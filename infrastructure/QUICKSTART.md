# Quick Start Guide - AWS Deployment

Get Synonym Roll deployed to AWS in under 30 minutes.

## Prerequisites

- AWS account
- Domain in Route 53: `synonym-roll.com`
- AWS CLI configured
- Node.js 18+

## 5-Minute Setup

### 1. Install CDK

```bash
npm install -g aws-cdk
```

### 2. Configure Infrastructure

```bash
cd infrastructure
npm install

# Create .env file
cat > .env << EOF
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=us-east-1
DOMAIN_NAME=synonym-roll.com
EOF
```

### 3. Bootstrap AWS (First Time Only)

```bash
# Get your account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Bootstrap
cdk bootstrap aws://$AWS_ACCOUNT_ID/us-east-1
```

### 4. Build React App

```bash
cd ../app
npm install
npm run build
```

### 5. Deploy Everything

```bash
cd ../infrastructure
npm run deploy
```

That's it! ☕️ Take a coffee break for 20 minutes while:
- SSL certificate is created and validated
- CloudFront distribution is deployed
- DNS records are configured

## Verify Deployment

After 20 minutes:

```bash
# Test your site
curl -I https://synonym-roll.com
curl -I https://www.synonym-roll.com

# Open in browser
open https://synonym-roll.com
```

## Update Your Site

After making changes:

```bash
cd app
npm run deploy:aws:app
```

Updates deploy in 2-5 minutes.

## Outputs After Deployment

You'll see:

```
Outputs:
SynonymRollStack.BucketName = synonym-roll.com-website
SynonymRollStack.DistributionId = E1234567890ABC
SynonymRollStack.WebsiteURL = https://synonym-roll.com
SynonymRollStack.WwwWebsiteURL = https://www.synonym-roll.com
```

Save the Distribution ID for cache invalidation if needed.

## Common Commands

```bash
# Deploy full infrastructure
cd infrastructure && npm run deploy

# Deploy app updates only
cd app && npm run deploy:aws:app

# Preview changes before deploying
cd infrastructure && npm run diff

# View CloudFormation template
cd infrastructure && npm run synth

# Destroy everything (careful!)
cd infrastructure && npm run destroy
```

## Costs

Approximately **$2-4/month** for low traffic:
- Route 53: $0.50/month
- S3: $0.50/month
- CloudFront: $1-3/month
- Certificate: Free

## Need Help?

- Full docs: [DEPLOYMENT.md](../DEPLOYMENT.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Infrastructure details: [README.md](README.md)

## Troubleshooting

### Certificate Taking Too Long?

Check it in AWS Console: Certificate Manager → us-east-1 region

Should auto-validate with Route 53 in 5-10 minutes.

### Site Not Loading?

1. Wait full 20 minutes for CloudFront
2. Check CloudFront distribution status in console
3. Verify DNS: `dig A synonym-roll.com`

### Build Errors?

```bash
cd app
rm -rf dist node_modules
npm install
npm run build
```

---

🎉 **You're all set!** Visit https://synonym-roll.com

