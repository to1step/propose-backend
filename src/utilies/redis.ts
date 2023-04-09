import { createClient, RedisClientType } from 'redis';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

class Redis {
	private static instance: Redis;

	private readonly client: RedisClientType;

	private constructor() {
		this.client = createClient({
			url: 'redis://15.235.163.75:4004',
		});

		this.client.on('error', (err) => logger.error(err));
	}

	static getInstance(): Redis {
		if (!Redis.instance) {
			Redis.instance = new Redis();
		}
		return Redis.instance;
	}

	getClient() {
		return this.client;
	}
}

export default Redis;
