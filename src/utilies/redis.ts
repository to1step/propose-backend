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
			url: `${process.env.REDIS_URL}`,
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
		seconds: number
	): Promise<void> {
		await this.client.hSet(key, value);
	}

	async setExpireTime(key: string, millisecond: number): Promise<void> {
		await this.client.pExpire(key, millisecond);
	}

	async getObjectData(key: string): Promise<{ [key: string]: any }> {
		return this.client.hGetAll(key);
	}
}

export default Redis;
