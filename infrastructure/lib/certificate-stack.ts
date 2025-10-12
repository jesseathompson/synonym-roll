import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export interface CertificateStackProps extends cdk.StackProps {
	domainName: string
	hostedZoneId?: string
}

export class CertificateStack extends cdk.Stack {
	public readonly certificate: acm.ICertificate

	constructor(scope: Construct, id: string, props: CertificateStackProps) {
		super(scope, id, props)

		const { domainName, hostedZoneId } = props

		// Look up the hosted zone for the domain
		const hostedZone = hostedZoneId
			? route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
				hostedZoneId,
				zoneName: domainName,
			})
			: route53.HostedZone.fromLookup(this, 'HostedZone', {
				domainName: domainName,
			})

		// Create certificate for both apex and www subdomain
		// Must be in us-east-1 for CloudFront
		this.certificate = new acm.Certificate(this, 'SiteCertificate', {
			domainName: domainName,
			subjectAlternativeNames: [`www.${domainName}`],
			validation: acm.CertificateValidation.fromDns(hostedZone),
		})

		// Export the certificate ARN for use in other stacks
		new cdk.CfnOutput(this, 'CertificateArn', {
			value: this.certificate.certificateArn,
			description: 'ARN of the SSL certificate',
			exportName: 'SynonymRollCertificateArn',
		})

		// Export hosted zone ID for use in other stacks
		new cdk.CfnOutput(this, 'HostedZoneId', {
			value: hostedZone.hostedZoneId,
			description: 'Route53 Hosted Zone ID',
			exportName: 'SynonymRollHostedZoneId',
		})

		new cdk.CfnOutput(this, 'HostedZoneName', {
			value: hostedZone.zoneName,
			description: 'Route53 Hosted Zone Name',
			exportName: 'SynonymRollHostedZoneName',
		})
	}
}

