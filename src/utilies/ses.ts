import { Credentials, SES, config } from 'aws-sdk';

class AWS {
	private ses: SES;

	constructor() {
		const credentials = new Credentials({
			accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
			secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
		});

		config.update({
			credentials: credentials,
			region: 'ap-northeast-1',
		});

		this.ses = new SES({ apiVersion: '2010-12-01' });
	}

	/**
	 * 해당 이메일로 인증코드 보내기
	 * @param email
	 * @param verifyCode
	 */
	sendEmail(email: string, verifyCode: string): void {
		const params = {
			Destination: {
				CcAddresses: [
					// 발신자 email
					`${process.env.AWS_SES_SENDER}`,
				],
				// 수신자 email
				ToAddresses: [email],
			},
			Message: {
				Body: {
					Html: {
						// email 내용
						Charset: 'UTF-8',
						Data: verifyCode,
					},
				},
				Subject: {
					// email 제목
					Charset: 'UTF-8',
					Data: 'to1step email verify code',
				},
			},
			Source: `${process.env.AWS_SES_SENDER}`,
		};

		this.ses.sendEmail(params).promise();
	}
}

export default AWS;
