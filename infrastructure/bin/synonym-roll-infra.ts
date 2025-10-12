#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CertificateStack } from '../lib/certificate-stack'
import { SynonymRollStack } from '../lib/synonym-roll-stack'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = new cdk.App()

// Configuration
const domainName = process.env.DOMAIN_NAME || 'synonym-roll.com'
const awsAccount = process.env.AWS_ACCOUNT_ID || process.env.CDK_DEFAULT_ACCOUNT
const awsRegion = process.env.AWS_REGION || 'us-east-1'
const hostedZoneId = process.env.HOSTED_ZONE_ID

// Validate required configuration
if (!awsAccount) {
	throw new Error(
		'AWS_ACCOUNT_ID must be set in environment variables or CDK_DEFAULT_ACCOUNT must be available'
	)
}

// Certificate Stack - Must be in us-east-1 for CloudFront
const certificateStack = new CertificateStack(
	app,
	'SynonymRollCertificateStack',
	{
		domainName,
		hostedZoneId,
		env: {
			account: awsAccount,
			region: 'us-east-1', // CloudFront certificates must be in us-east-1
		},
		crossRegionReferences: true,
		description: 'SSL/TLS Certificate for Synonym Roll (must be in us-east-1)',
	}
)

// Main Application Stack
const appStack = new SynonymRollStack(app, 'SynonymRollStack', {
	domainName,
	certificate: certificateStack.certificate,
	hostedZoneId:
		hostedZoneId ||
		cdk.Fn.importValue('SynonymRollHostedZoneId'),
	env: {
		account: awsAccount,
		region: awsRegion,
	},
	crossRegionReferences: true,
	description: 'Main infrastructure stack for Synonym Roll web application',
})

// Add dependency
appStack.addDependency(certificateStack)

// Tags for all resources
cdk.Tags.of(app).add('Project', 'SynonymRoll')
cdk.Tags.of(app).add('ManagedBy', 'CDK')
cdk.Tags.of(app).add('Environment', 'Production')

