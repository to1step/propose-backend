import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

/**
 * static 변수는 가장먼저 메모리에 올라가기 떄문에 dotenv.config()보다 먼저 실행되어 process.env가 적용되지 않는다.
 */
dotenv.config();

class Redis {
	private static instance: Redis;

	private readonly client: RedisClientType;

	constructor() {
		this.client = createClient({
			url: process.env.REDIS_URL,
		});

		this.client.on('connect', () => {
			logger.info('redis connect!!!');
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
		logger.info(`Redis Connected`);
	}

	getClient(): RedisClientType {
		return this.client;
	}
}

export default Redis;
