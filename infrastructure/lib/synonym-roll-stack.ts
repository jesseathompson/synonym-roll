import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import * as path from 'path'

export interface SynonymRollStackProps extends cdk.StackProps {
	domainName: string
	certificate: acm.ICertificate
	hostedZoneId: string
}

export class SynonymRollStack extends cdk.Stack {
	public readonly distribution: cloudfront.Distribution
	public readonly bucket: s3.Bucket

	constructor(scope: Construct, id: string, props: SynonymRollStackProps) {
		super(scope, id, props)

		const { domainName, certificate, hostedZoneId } = props

		// Look up the hosted zone
		const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
			this,
			'HostedZone',
			{
				hostedZoneId,
				zoneName: domainName,
			}
		)

		// Create S3 bucket for the website content
		// NOTE: Do NOT enable website hosting - CloudFront OAI requires REST API endpoint
		this.bucket = new s3.Bucket(this, 'WebsiteBucket', {
			bucketName: `${domainName}-website`,
			publicReadAccess: false,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
			autoDeleteObjects: false,
			encryption: s3.BucketEncryption.S3_MANAGED,
		})

		// Create Origin Access Identity for CloudFront
		const originAccessIdentity = new cloudfront.OriginAccessIdentity(
			this,
			'OAI',
			{
				comment: `OAI for ${domainName}`,
			}
		)

		// Grant read permissions to CloudFront
		this.bucket.addToResourcePolicy(
			new iam.PolicyStatement({
				actions: ['s3:GetObject'],
				resources: [this.bucket.arnForObjects('*')],
				principals: [
					new iam.CanonicalUserPrincipal(
						originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
					),
				],
			})
		)

		// Create CloudFront distribution
		this.distribution = new cloudfront.Distribution(this, 'Distribution', {
			defaultBehavior: {
				origin: new origins.S3Origin(this.bucket, {
					originAccessIdentity,
				}),
				viewerProtocolPolicy:
					cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
				cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
				compress: true,
				cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
			},
			domainNames: [domainName, `www.${domainName}`],
			certificate: certificate,
			minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
			errorResponses: [
				{
					httpStatus: 403,
					responseHttpStatus: 200,
					responsePagePath: '/index.html',
					ttl: cdk.Duration.minutes(30),
				},
				{
					httpStatus: 404,
					responseHttpStatus: 200,
					responsePagePath: '/index.html',
					ttl: cdk.Duration.minutes(30),
				},
			],
			defaultRootObject: 'index.html',
			priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
			comment: `Synonym Roll - ${domainName}`,
		})

		// Create Route53 A record for apex domain
		new route53.ARecord(this, 'ApexAliasRecord', {
			zone: hostedZone,
			recordName: domainName,
			target: route53.RecordTarget.fromAlias(
				new targets.CloudFrontTarget(this.distribution)
			),
		})

		// Create Route53 A record for www subdomain
		new route53.ARecord(this, 'WwwAliasRecord', {
			zone: hostedZone,
			recordName: `www.${domainName}`,
			target: route53.RecordTarget.fromAlias(
				new targets.CloudFrontTarget(this.distribution)
			),
		})

		// Deploy the website content from the React build
		const appDistPath = path.join(__dirname, '..', '..', 'app', 'dist')

		new s3deploy.BucketDeployment(this, 'DeployWebsite', {
			sources: [s3deploy.Source.asset(appDistPath)],
			destinationBucket: this.bucket,
			distribution: this.distribution,
			distributionPaths: ['/*'],
		})

		// Outputs
		new cdk.CfnOutput(this, 'BucketName', {
			value: this.bucket.bucketName,
			description: 'S3 bucket name',
		})

		new cdk.CfnOutput(this, 'DistributionId', {
			value: this.distribution.distributionId,
			description: 'CloudFront distribution ID',
		})

		new cdk.CfnOutput(this, 'DistributionDomainName', {
			value: this.distribution.distributionDomainName,
			description: 'CloudFront distribution domain name',
		})

		new cdk.CfnOutput(this, 'WebsiteURL', {
			value: `https://${domainName}`,
			description: 'Website URL',
		})

		new cdk.CfnOutput(this, 'WwwWebsiteURL', {
			value: `https://www.${domainName}`,
			description: 'Website URL with www',
		})
	}
}

