import dotenv from 'dotenv';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

dotenv.config();

class NodeMailer {
	private static instance: NodeMailer;

	private transporter: Transporter<SMTPTransport.SentMessageInfo>;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: process.env.MAIL_SERVICE,
			auth: {
				user: process.env.MAIL_ID,
				pass: process.env.MAIL_PASSWORD,
			},
		});
	}

	static getInstance(): NodeMailer {
		if (!NodeMailer.instance) {
			NodeMailer.instance = new NodeMailer();
		}

		return NodeMailer.instance;
	}

	async sendMail(receiverEmail: string, verifyCode: string) {
		try {
			await this.transporter.sendMail({
				from: process.env.MAIL_SENDER,
				to: `${receiverEmail}`,
				subject: '메일제목',
				text: '보낼 내용',
				html: `<div>${verifyCode}</div>`,
			});

			logger.info(`Mail sended to ${receiverEmail}`);
		} catch (error) {
			console.log(error);
		}
	}
}

export default NodeMailer;
