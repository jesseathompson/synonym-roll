# Synonym Roll - AWS Deployment Guide

Complete guide for deploying Synonym Roll to AWS with custom domain.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Users → Route 53 → CloudFront → S3 Bucket → React App        │
│              ↓            ↓                                    │
│         DNS Records    SSL/TLS                                 │
│                      Certificate                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Components

1. **Route 53**: DNS management for synonym-roll.com
2. **ACM Certificate**: SSL/TLS certificate for HTTPS (us-east-1)
3. **S3 Bucket**: Static website hosting
4. **CloudFront**: Global CDN with HTTPS and caching
5. **Both Domains**: synonym-roll.com and www.synonym-roll.com

## Prerequisites

### 1. AWS Account Setup

- AWS account with administrative access
- AWS CLI installed and configured
- Credentials configured (`~/.aws/credentials`)

```bash
# Verify AWS CLI
aws --version
aws sts get-caller-identity
```

### 2. Domain Registration

- Domain purchased and hosted in Route 53
- Nameservers updated (if transferred from another registrar)
- Hosted zone exists in Route 53

```bash
# Find your hosted zone ID
aws route53 list-hosted-zones
```

### 3. Local Environment

- Node.js 18+ installed
- npm or yarn package manager
- AWS CDK Toolkit installed globally

```bash
# Install CDK globally
npm install -g aws-cdk

# Verify installation
cdk --version
```

## Step-by-Step Deployment

### Step 1: Configure Infrastructure

```bash
cd infrastructure

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your values:

```bash
AWS_ACCOUNT_ID=123456789012        # Your AWS account ID
AWS_REGION=us-east-1               # Primary region
DOMAIN_NAME=synonym-roll.com       # Your domain
# HOSTED_ZONE_ID=Z1234567890ABC    # Optional: your hosted zone ID
```

### Step 2: Bootstrap CDK (First Time Only)

Bootstrap CDK in us-east-1 (required for CloudFront certificates):

```bash
# Get your AWS account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Bootstrap us-east-1
cdk bootstrap aws://$AWS_ACCOUNT_ID/us-east-1

# Bootstrap your primary region if different
cdk bootstrap aws://$AWS_ACCOUNT_ID/us-east-2  # Example for us-east-2
```

### Step 3: Build the React Application

```bash
cd ../app

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates the `app/dist/` directory with optimized production files.

### Step 4: Review Infrastructure Changes

```bash
cd ../infrastructure

# Synthesize CloudFormation templates
npm run synth

# Preview changes that will be deployed
npm run diff
```

### Step 5: Deploy Infrastructure

**Option A: Deploy Everything**

```bash
npm run deploy
```

This deploys both stacks:
1. Certificate Stack (us-east-1)
2. Application Stack (with S3, CloudFront, Route 53)

**Option B: Deploy Step by Step**

```bash
# Deploy certificate first
npm run deploy:cert

# Wait for certificate validation (usually automatic)
# Then deploy application
npm run deploy:app
```

### Step 6: Wait for Certificate Validation

If using Route 53 DNS validation (automatic):
- Validation usually completes in 5-10 minutes
- CDK creates DNS records automatically
- No manual action required

Monitor in AWS Console:
- Go to Certificate Manager (us-east-1 region)
- Check certificate status

### Step 7: Wait for CloudFront Distribution

CloudFront distribution deployment takes 15-20 minutes.

Monitor progress:
```bash
# Get distribution ID from output
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

Or check in AWS Console:
- Go to CloudFront service
- Watch for status to change from "In Progress" to "Deployed"

### Step 8: Verify Deployment

Once deployed, test both URLs:

```bash
# Test apex domain
curl -I https://synonym-roll.com

# Test www subdomain  
curl -I https://www.synonym-roll.com

# Test in browser
open https://synonym-roll.com
```

Verify:
- ✅ Both URLs load the site
- ✅ HTTPS is working (green lock icon)
- ✅ SSL certificate is valid
- ✅ Client-side routing works (refresh on any route)

## Updating the Application

### Regular Updates

After making changes to the React app:

```bash
cd app

# Build updated app
npm run build

# Deploy update
npm run deploy:aws:app
```

This will:
1. Build the React app
2. Sync files to S3
3. Invalidate CloudFront cache
4. Deploy changes (~2-5 minutes)

### Quick Deploy from App Directory

```bash
cd app
npm run deploy:aws:app
```

### Infrastructure Updates

If you modify CDK infrastructure code:

```bash
cd infrastructure

# Review changes
npm run diff

# Deploy infrastructure changes
npm run deploy
```

## Troubleshooting

### Certificate Validation Stuck

**Symptoms**: Certificate stays in "Pending validation" status

**Solutions**:
1. Verify domain uses Route 53 nameservers:
   ```bash
   dig NS synonym-roll.com
   ```
2. Check hosted zone has validation records:
   ```bash
   aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID
   ```
3. Wait up to 30 minutes for DNS propagation

### CloudFront Shows 403 Error

**Symptoms**: CloudFront URL returns 403 Forbidden

**Solutions**:
1. Verify S3 bucket has files:
   ```bash
   aws s3 ls s3://synonym-roll.com-website/
   ```
2. Check CloudFront Origin Access Identity has permissions
3. Verify index.html exists in bucket root

### Domain Not Resolving

**Symptoms**: Domain doesn't load, DNS errors

**Solutions**:
1. Verify A records in Route 53:
   ```bash
   dig A synonym-roll.com
   dig A www.synonym-roll.com
   ```
2. Check Route 53 records point to CloudFront
3. Wait for DNS propagation (up to 48 hours)

### Build Fails

**Symptoms**: React build fails or CDK deploy fails

**Solutions**:
1. Verify Node.js version: `node --version` (need 18+)
2. Clean and rebuild:
   ```bash
   cd app
   rm -rf node_modules dist
   npm install
   npm run build
   ```
3. Check for TypeScript errors: `npm run lint`

### CloudFront Cache Issues

**Symptoms**: Updated content not showing

**Solutions**:
1. Deploy includes cache invalidation, but manual clear:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DIST_ID \
     --paths "/*"
   ```
2. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Cost Estimation

### Monthly Costs (Low Traffic)

| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| Route 53 | 1 hosted zone | $0.50 |
| S3 | 100 MB storage + 1,000 requests | $0.50 |
| CloudFront | 10 GB transfer + 10,000 requests | $1-3 |
| ACM Certificate | 1 certificate | Free |
| **Total** | | **$2-4/month** |

### Monthly Costs (Medium Traffic)

| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| Route 53 | 1 hosted zone + 1M queries | $1 |
| S3 | 100 MB storage + 100,000 requests | $2 |
| CloudFront | 100 GB transfer + 1M requests | $10-15 |
| ACM Certificate | 1 certificate | Free |
| **Total** | | **$13-18/month** |

## Security Best Practices

### Current Security Features

- ✅ S3 bucket is private (no public access)
- ✅ CloudFront Origin Access Identity (OAI) for S3 access
- ✅ HTTPS enforced (HTTP redirects to HTTPS)
- ✅ TLS 1.2+ minimum protocol version
- ✅ SSL certificate auto-renewal by ACM

### Additional Recommendations

1. **Enable CloudFront Access Logs**:
   ```typescript
   // Add to CloudFront distribution
   loggingConfig: {
     bucket: logBucket,
     prefix: 'cloudfront-logs/',
   }
   ```

2. **Add WAF for DDoS Protection**:
   ```bash
   # Enable AWS Shield Standard (free)
   # Consider AWS WAF for advanced protection
   ```

3. **Enable S3 Versioning**:
   ```typescript
   // Add to S3 bucket
   versioned: true,
   ```

## Monitoring & Maintenance

### CloudWatch Metrics

Monitor key metrics in AWS Console:
- CloudFront: Requests, Bytes Downloaded, Error Rate
- S3: Number of Objects, Bucket Size
- Route 53: Query Count

### Setting Up Alarms

```bash
# Example: Alert on CloudFront 5xx errors
aws cloudwatch put-metric-alarm \
  --alarm-name synonym-roll-5xx-errors \
  --metric-name 5xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

### Regular Maintenance

- **Weekly**: Review CloudWatch metrics
- **Monthly**: Check AWS costs and usage
- **Quarterly**: Review CloudFront logs for optimization
- **Annually**: Review and rotate credentials

## Rollback Procedure

If deployment fails or has issues:

### Rollback Application

```bash
# S3 versioning allows rollback
aws s3 sync s3://synonym-roll.com-website-backup/ s3://synonym-roll.com-website/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Rollback Infrastructure

```bash
cd infrastructure

# Destroy and redeploy previous version
npm run destroy  # Caution: destroys all resources
git checkout PREVIOUS_COMMIT
npm run deploy
```

## Cleanup / Destroy

To remove all AWS resources:

```bash
cd infrastructure

# Preview what will be deleted
cdk destroy --all --dry-run

# Destroy all resources
npm run destroy
```

**Warning**: This will:
- Delete S3 bucket (if empty)
- Delete CloudFront distribution
- Delete DNS records
- Delete certificate
- Your site will be offline

## Advanced Configuration

### Custom Cache Policies

Edit `infrastructure/lib/synonym-roll-stack.ts`:

```typescript
cachePolicy: new cloudfront.CachePolicy(this, 'CustomCachePolicy', {
  defaultTtl: cdk.Duration.days(1),
  maxTtl: cdk.Duration.days(365),
  minTtl: cdk.Duration.seconds(0),
}),
```

### Multiple Environments

To deploy staging and production:

1. Create separate `.env.staging` and `.env.production`
2. Modify `bin/synonym-roll-infra.ts` to read environment
3. Deploy with: `ENV=staging cdk deploy`

### Custom Error Pages

Add custom 404 page:

1. Create `app/public/404.html`
2. Modify error responses in CloudFront configuration

## Support

For issues or questions:

1. Check AWS CloudFormation events for errors
2. Review CloudWatch logs
3. Consult infrastructure/README.md
4. Open GitHub issue

## References

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Route 53 Documentation](https://docs.aws.amazon.com/route53/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/s3/static-website-hosting)

---

**Deployment completed!** 🚀

Your Synonym Roll game is now live at https://synonym-roll.com

