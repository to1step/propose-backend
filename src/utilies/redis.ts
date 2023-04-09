import { createClient, RedisClientType } from 'redis';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

class Redis {
	private static instance: Redis;

	private readonly client: RedisClientType;

	constructor() {
		this.client = createClient({
			url: `${process.env.REDIS_URL}`,
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

	/**
	 * object type 데이터 저장
	 * @param key
	 * @param value
	 * @param seconds
	 */
	async setObjectData(
		key: string,
		value: { [key: string]: any },
		seconds: number
	): Promise<void> {
		await this.client.hSet(key, value);
	}

	/**
	 * object 데이터 가져오기
	 * @param key
	 */
	async getObjectData(key: string): Promise<{ [key: string]: any }> {
		return this.client.hGetAll(key);
	}

	/**
	 * 해당 key에 대한 만료시간 설정 millisecond 단위
	 * @param key
	 * @param millisecond
	 */
	async setExpireTime(key: string, millisecond: number): Promise<void> {
		await this.client.pExpire(key, millisecond);
	}
}

export default Redis;
