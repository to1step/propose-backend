import {
	Client,
	IntentsBitField,
	TextChannel,
	EmbedBuilder,
	Channel,
} from 'discord.js';
import dotenv from 'dotenv';
import WinstonLogger from './logger';
import { InternalServerError } from '../lib/middlewares/errors';
import ErrorCode from '../lib/types/customTypes/error';

const logger = WinstonLogger.getInstance();

dotenv.config();

class ErrorBot {
	private static instance: ErrorBot;

	private readonly errorBot: Client;

	constructor() {
		this.errorBot = new Client({
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMembers,
				IntentsBitField.Flags.GuildMessages,
			],
		});

		this.errorBot.on('ready', () => {
			logger.info(`Error Bot Connected`);
		});
	}

	static getInstance(): ErrorBot {
		if (!ErrorBot.instance) {
			ErrorBot.instance = new ErrorBot();
		}

		return ErrorBot.instance;
	}

	async connect(): Promise<void> {
		await this.errorBot.login(process.env.DISCORD_BOT_TOKEN);
	}

	async sendMessage(message: string): Promise<void> {
		try {
			let channels: Channel | null;

			if (process.env.NODE_ENV === 'production') {
				channels = await this.errorBot.channels.fetch(
					`${process.env.DISCORD_PROD_CHANNEL_ID}`
				);
			} else {
				channels = await this.errorBot.channels.fetch(
					`${process.env.DISCORD_PROD_CHANNEL_ID}`
				);
			}

			if (!channels || !(channels instanceof TextChannel)) {
				throw new Error('Discord error');
			}

			const embed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle('에러 발생 비상 비상!')
				.setDescription(`${message}`);

			await channels.send({ embeds: [embed] });
		} catch (error: any) {
			// TODO: 에러메세지를 보내는 애가 에러가 났을때는 어떻게 할까에 대한 논의
			logger.error(error.message);
		}
	}
}

export default ErrorBot;
