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

type Embed = {
	color: number;
	title: string;
	description: string;
	fields: {
		name: string;
		value: string;
		inline?: boolean;
	}[];
};

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

	async sendMessage(
		type: 'error' | 'latency',
		message: string,
		userUUID: string,
		userIp: string,
		duration?: number
	): Promise<void> {
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

			const exampleEmbed: Embed = {
				color: 0x0099ff,
				title: type === 'error' ? 'Error occured' : 'Api latency',
				description:
					type === 'error' ? `${message}` : `${message} ${duration}ms`,
				fields: [
					{
						name: 'Ip',
						value: `${userIp ?? 'null'}`,
						inline: true,
					},
					{
						name: 'UserId',
						value: `${userUUID ?? 'null'}`,
						inline: true,
					},
					{
						name: 'Time',
						value: `${new Date()}`,
						inline: true,
					},
				],
			};

			await channels.send({ embeds: [exampleEmbed] });
		} catch (error: any) {
			logger.error(error.message);
		}
	}
}

export default ErrorBot;
