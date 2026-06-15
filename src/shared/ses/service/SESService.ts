export type SendTemporaryPasswordEmailRequest = {
	toEmail: string;
	firstName: string;
	temporaryPassword: string;
	templateS3Key: string;
};

export interface SESService {
	sendTemporaryPasswordEmail(request: SendTemporaryPasswordEmailRequest): Promise<void>;
}
