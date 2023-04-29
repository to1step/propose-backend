import { Credentials, SES } from 'aws-sdk';

class SESClient {
	private static instance: SESClient;

	private ses: SES;

	constructor() {
		const credentials = new Credentials({
			accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
			secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
		});

		this.ses = new SES({
			apiVersion: 'latest',
			credentials: credentials,
			region: 'ap-northeast-1',
		});
	}

	static getInstance(): SESClient {
		if (!SESClient.instance) {
			SESClient.instance = new SESClient();
		}

		return SESClient.instance;
	}

	/**
	 * 해당 이메일로 인증코드 보내기
	 * @param email
	 * @param verifyCode
	 */
	async sendEmail(email: string, verifyCode: string): Promise<void> {
		const params: SES.Types.SendEmailRequest = {
			Destination: {
				// 수신자 email
				ToAddresses: [email],
			},
			Message: {
				Subject: {
					// email 제목
					Charset: 'UTF-8',
					Data: 'to1step email verify code',
				},
				Body: {
					Html: {
						// email 내용
						Charset: 'UTF-8',
						Data: verifyCode,
					},
				},
			},
			Source: `${process.env.AWS_SES_SENDER}`,
		};

		await this.ses.sendEmail(params).promise();
	}
}

export default SESClient;
