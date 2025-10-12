# Synonym Roll Infrastructure

AWS CDK infrastructure for deploying Synonym Roll to AWS with S3, CloudFront, and Route 53.

## Architecture

- **S3 Bucket**: Hosts the static React application files
- **CloudFront**: CDN distribution with HTTPS support
- **ACM Certificate**: SSL/TLS certificate for both apex and www domains
- **Route 53**: DNS records for synonym-roll.com and www.synonym-roll.com

## Prerequisites

1. **AWS CLI** installed and configured with credentials
2. **Node.js** 18+ installed
3. **Domain** purchased and hosted in Route 53 (synonym-roll.com)
4. **AWS CDK** toolkit installed globally:
   ```bash
   npm install -g aws-cdk
   ```

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```bash
   AWS_ACCOUNT_ID=123456789012
   AWS_REGION=us-east-1
   DOMAIN_NAME=synonym-roll.com
   # HOSTED_ZONE_ID=Z1234567890ABC  # Optional, will be looked up automatically
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## CDK Bootstrap

If this is your first time using CDK in your AWS account, bootstrap it:

```bash
cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```

For this project, bootstrap both us-east-1 (for certificates) and your target region:

```bash
cdk bootstrap aws://ACCOUNT-NUMBER/us-east-1
```

## Deployment

### Full Deployment

Deploy both the certificate and application stacks:

```bash
npm run deploy
```

This will:
1. Create the ACM certificate in us-east-1
2. Validate the certificate via DNS (automatic with Route 53)
3. Create S3 bucket, CloudFront distribution, and Route 53 records
4. Deploy the React app from `../app/dist/`

### Step-by-Step Deployment

If you prefer to deploy in stages:

1. **Build the React app first:**
   ```bash
   cd ../app
   npm run build
   cd ../infrastructure
   ```

2. **Deploy certificate stack:**
   ```bash
   npm run deploy:cert
   ```

3. **Deploy application stack:**
   ```bash
   npm run deploy:app
   ```

## Updating the Website

After making changes to the React app:

1. **Rebuild the app:**
   ```bash
   cd ../app
   npm run build
   ```

2. **Redeploy:**
   ```bash
   cd ../infrastructure
   npm run deploy:app
   ```

The CDK will automatically sync the new files to S3 and invalidate the CloudFront cache.

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run cdk` - Run CDK CLI commands
- `npm run deploy` - Deploy all stacks
- `npm run deploy:cert` - Deploy only certificate stack
- `npm run deploy:app` - Deploy only application stack
- `npm run diff` - Compare deployed stack with current state
- `npm run synth` - Synthesize CloudFormation templates
- `npm run destroy` - Destroy all stacks (use with caution!)

## Stack Information

### Certificate Stack (us-east-1)

Creates an ACM certificate for:
- `synonym-roll.com`
- `www.synonym-roll.com`

Uses DNS validation which is automatic with Route 53.

### Application Stack

Creates:
- S3 bucket with website hosting
- CloudFront distribution with:
  - HTTPS redirect
  - Custom error pages for SPA routing
  - Optimized caching
- Route 53 A records for apex and www domains
- Automatic deployment of React app

## Outputs

After deployment, you'll see these outputs:

- **BucketName**: S3 bucket name
- **DistributionId**: CloudFront distribution ID
- **DistributionDomainName**: CloudFront domain
- **WebsiteURL**: https://synonym-roll.com
- **WwwWebsiteURL**: https://www.synonym-roll.com

## Post-Deployment

1. Wait for CloudFront distribution to fully deploy (15-20 minutes)
2. Test both URLs:
   - https://synonym-roll.com
   - https://www.synonym-roll.com
3. Verify SSL certificate is valid
4. Test client-side routing (refresh on different routes)

## Troubleshooting

### Certificate Validation Pending

If the certificate validation is stuck:
1. Check Route 53 hosted zone has validation CNAME records
2. Wait up to 30 minutes for DNS propagation
3. Verify domain is using Route 53 nameservers

### CloudFront Shows Error

- Check S3 bucket has files deployed
- Verify CloudFront OAI has access to S3 bucket
- Check CloudFront error responses configuration

### Website Not Updating

- Run deployment again: `npm run deploy:app`
- Manually invalidate CloudFront cache:
  ```bash
  aws cloudfront create-invalidation \
    --distribution-id YOUR_DIST_ID \
    --paths "/*"
  ```

## Cost Estimation

Approximate monthly costs (low traffic):
- **S3**: $0.50 - $2
- **CloudFront**: $1 - $5
- **Route 53**: $0.50 (hosted zone)
- **ACM Certificate**: Free
- **Total**: ~$2-8/month for low traffic

## Security

- S3 bucket is private, only accessible via CloudFront
- HTTPS enforced via CloudFront
- SSL/TLS certificate auto-renewed by ACM
- No public bucket access

## License

MIT

