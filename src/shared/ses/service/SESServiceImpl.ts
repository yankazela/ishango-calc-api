import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Symbols } from '../../s3/ioc';
import type { S3Service } from '../../s3/service/S3Service';
import type { SESService, SendTemporaryPasswordEmailRequest } from './SESService';
import { Inject } from '@nestjs/common';

@Injectable()
export class SESServiceImpl implements SESService {
	private readonly sesClient: SESClient;
	private readonly senderEmail: string;

	constructor(
		private readonly configService: ConfigService,
		@Inject(S3Symbols.S3Service)
		private readonly s3Service: S3Service,
	) {
		const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
		const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

		this.senderEmail = this.configService.get<string>('AWS_SES_SENDER_EMAIL') ?? '';
		this.sesClient = new SESClient({
			region: this.configService.get<string>('AWS_REGION') ?? 'us-east-2',
			credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
		});
	}

	async sendTemporaryPasswordEmail(request: SendTemporaryPasswordEmailRequest): Promise<void> {
		const { toEmail, firstName, temporaryPassword, templateS3Key } = request;

		const templateFile = await this.s3Service.fetchFile(templateS3Key);
		const rawHtml = templateFile.body.toString('utf-8');
		const htmlBody = rawHtml
			.replace(/{{firstName}}/g, firstName)
			.replace(/{{temporaryPassword}}/g, temporaryPassword);

		try {
			await this.sesClient.send(
				new SendEmailCommand({
					Source: this.senderEmail,
					Destination: {
						ToAddresses: [toEmail],
					},
					Message: {
						Subject: {
							Data: 'Your temporary password',
							Charset: 'UTF-8',
						},
						Body: {
							Html: {
								Data: htmlBody,
								Charset: 'UTF-8',
							},
						},
					},
				}),
			);
		} catch (error) {
			console.error('Error sending temporary password email via SES:', error);
			throw new InternalServerErrorException('Unable to send temporary password email.');
		}
	}
}
