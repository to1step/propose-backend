import { createClient, RedisClientType } from 'redis';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

class Redis {
	private static instance: Redis;

	private readonly client: RedisClientType;

	static getInstance(): Redis {
		if (!Redis.instance) {
			Redis.instance = new Redis();
		}
		return Redis.instance;
	}

	private constructor() {
		this.client = createClient({
			url: 'redis://15.235.163.75:4004',
		});

		this.client.on('error', (err) => logger.error(err));
	}

	async connect(): Promise<void> {
		await this.client.connect();
		logger.info(`Redis Connected`);
	}

	async setObjectData(
		key: string,
		value: { [key: string]: any },
		second: number
	): Promise<void> {
		await this.client.hSet(key, value);
		await this.client.expire(key, second);
		logger.info(`${key} stored in redis`);
	}

	async getObjectData(key: string): Promise<{ [key: string]: any }> {
		return this.client.hGetAll(key);
	}
}

export default Redis;
