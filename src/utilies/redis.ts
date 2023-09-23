import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

dotenv.config();

class Redis {
	private static instance: Redis;

	private readonly client: RedisClientType;

	constructor() {
		if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
			this.client = createClient({
				url: process.env.DEV_REDIS_URL,
			});
		} else {
			this.client = createClient({
				url: process.env.PROD_REDIS_URL,
			});
		}

		this.client.on('connect', () => {
			logger.info(`Redis Connected`);
		});
		this.client.on('error', (err) => logger.error(err));
	}

	static getInstance(): Redis {
		if (!Redis.instance) {
			Redis.instance = new Redis();
		}

		return Redis.instance;
	}

	/**
	 * redis 연결
	 */
	async connect(): Promise<void> {
		await this.client.connect();
	}

	async disconnect(): Promise<void> {
		this.client.quit();
	}

	getClient(): RedisClientType {
		return this.client;
	}
}

export default Redis;
