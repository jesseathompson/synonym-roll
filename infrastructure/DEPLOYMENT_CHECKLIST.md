# AWS Deployment Checklist

Use this checklist to ensure a smooth deployment of Synonym Roll to AWS.

## Pre-Deployment Checklist

### AWS Account Setup
- [ ] AWS account created and accessible
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS credentials configured (`aws sts get-caller-identity`)
- [ ] IAM user has sufficient permissions (AdministratorAccess or equivalent)

### Domain Setup
- [ ] Domain purchased (synonym-roll.com)
- [ ] Domain transferred to Route 53 (or nameservers updated)
- [ ] Route 53 hosted zone exists
- [ ] Hosted zone ID noted (optional, can be auto-detected)

### Local Environment
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed and working (`npm --version`)
- [ ] AWS CDK installed globally (`cdk --version`)
- [ ] Repository cloned locally

### Infrastructure Configuration
- [ ] `cd infrastructure && npm install` completed
- [ ] `.env` file created from `.env.example`
- [ ] AWS_ACCOUNT_ID set in `.env`
- [ ] DOMAIN_NAME set in `.env`
- [ ] AWS_REGION set in `.env` (us-east-1 recommended)

### Application Build
- [ ] `cd app && npm install` completed
- [ ] `npm run build` succeeds
- [ ] `app/dist/` directory exists with files
- [ ] `app/dist/index.html` exists

## Deployment Checklist

### Step 1: CDK Bootstrap
- [ ] Run: `cdk bootstrap aws://ACCOUNT-ID/us-east-1`
- [ ] Bootstrap succeeds without errors
- [ ] CDK toolkit stack created in CloudFormation

### Step 2: Infrastructure Synthesis
- [ ] `cd infrastructure`
- [ ] `npm run synth` succeeds
- [ ] `cdk.out/` directory created
- [ ] No TypeScript compilation errors

### Step 3: Preview Changes
- [ ] `npm run diff` shows expected resources
- [ ] Review S3 bucket configuration
- [ ] Review CloudFront settings
- [ ] Review Route 53 records

### Step 4: Deploy Certificate Stack
- [ ] `npm run deploy:cert` initiated
- [ ] CloudFormation stack creation started
- [ ] Certificate request submitted
- [ ] DNS validation records created automatically
- [ ] Certificate status: "Issued" (may take 5-10 minutes)

### Step 5: Deploy Application Stack
- [ ] Certificate validation complete
- [ ] `npm run deploy:app` initiated
- [ ] S3 bucket created
- [ ] CloudFront distribution created
- [ ] Route 53 A records created
- [ ] Files uploaded to S3
- [ ] No deployment errors

### Step 6: Wait for Propagation
- [ ] CloudFront status: "Deployed" (15-20 minutes)
- [ ] DNS propagation complete (test with `dig synonym-roll.com`)

## Post-Deployment Verification

### SSL/TLS Certificate
- [ ] Certificate valid in ACM (us-east-1 region)
- [ ] Certificate covers both domains (apex and www)
- [ ] No validation errors

### S3 Bucket
- [ ] Bucket created: `synonym-roll.com-website`
- [ ] Files uploaded successfully
- [ ] `index.html` exists in root
- [ ] Bucket is private (no public access)

### CloudFront Distribution
- [ ] Distribution status: "Deployed"
- [ ] Distribution domain name accessible
- [ ] HTTPS working
- [ ] Origin points to S3 bucket
- [ ] Error responses configured (404 → index.html)

### Route 53 DNS
- [ ] A record exists for apex domain
- [ ] A record exists for www subdomain
- [ ] Both records point to CloudFront (alias records)
- [ ] DNS resolving correctly: `dig A synonym-roll.com`

### Website Access
- [ ] https://synonym-roll.com loads
- [ ] https://www.synonym-roll.com loads
- [ ] Both URLs show the same content
- [ ] SSL certificate valid (green lock)
- [ ] No browser security warnings

### Application Functionality
- [ ] Home page loads correctly
- [ ] Game page loads correctly
- [ ] Client-side routing works (refresh any route)
- [ ] Assets load (images, fonts, CSS)
- [ ] JavaScript executes without errors (check console)
- [ ] Game is playable

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Subsequent navigation instant (SPA)
- [ ] Assets cached properly
- [ ] No 404 errors in browser console

## Troubleshooting Checklist

If something goes wrong:

### Certificate Issues
- [ ] Check certificate status in ACM console
- [ ] Verify DNS validation records in Route 53
- [ ] Wait up to 30 minutes for validation
- [ ] Check domain uses Route 53 nameservers

### CloudFront Issues
- [ ] Check distribution status (not "In Progress")
- [ ] Verify origin access identity configured
- [ ] Check S3 bucket policy allows CloudFront
- [ ] Test CloudFront URL directly

### DNS Issues
- [ ] Verify hosted zone nameservers match domain
- [ ] Check A records exist and are aliases
- [ ] Test with `dig A synonym-roll.com`
- [ ] Wait up to 48 hours for propagation

### Build Issues
- [ ] Clean build: `rm -rf app/dist app/node_modules`
- [ ] Reinstall: `cd app && npm install`
- [ ] Rebuild: `npm run build`
- [ ] Check for TypeScript errors

### CDK Deploy Issues
- [ ] Check AWS credentials are valid
- [ ] Verify account has sufficient permissions
- [ ] Review CloudFormation stack events
- [ ] Check for resource naming conflicts

## Maintenance Checklist

### Weekly
- [ ] Check CloudWatch metrics for errors
- [ ] Review CloudFront bandwidth usage
- [ ] Verify SSL certificate is valid

### Monthly
- [ ] Review AWS billing dashboard
- [ ] Check for cost anomalies
- [ ] Review access logs (if enabled)
- [ ] Update CDK and dependencies

### Quarterly
- [ ] Audit IAM permissions
- [ ] Review security best practices
- [ ] Test disaster recovery procedure
- [ ] Update documentation

## Rollback Checklist

If you need to rollback:

### Application Rollback
- [ ] Have previous dist/ backup
- [ ] Sync backup to S3
- [ ] Invalidate CloudFront cache
- [ ] Verify old version works

### Infrastructure Rollback
- [ ] Checkout previous git commit
- [ ] Run `npm run deploy`
- [ ] Verify resources restored
- [ ] Test functionality

## Success Criteria

Deployment is successful when:

- ✅ Both URLs (apex and www) load the site
- ✅ HTTPS works with valid certificate
- ✅ Game is fully playable
- ✅ Client-side routing works correctly
- ✅ All assets load without errors
- ✅ Performance is acceptable (< 3s initial load)
- ✅ No console errors
- ✅ Mobile responsive design works

## Next Steps After Successful Deployment

1. Set up monitoring alerts
2. Configure CloudWatch dashboards
3. Enable S3 versioning
4. Set up backup strategy
5. Document update procedures
6. Share site with users!

---

**Congratulations! Your Synonym Roll game is live!** 🎉

Visit: https://synonym-roll.com

