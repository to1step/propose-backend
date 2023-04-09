import { createClient } from 'redis';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

class Redis {
	private static instance: Redis;

	private readonly client;

	private constructor() {
		this.client = createClient({
			url: `redis://15.235.163.75:4004`,
		});

		this.client.on('connect', () => {
			logger.info('Redis Connected');
		});

		this.client.on('error', (err) => logger.error(err));
	}

	public static getInstance(): Redis {
		if (!Redis.instance) {
			Redis.instance = new Redis();
		}
		return Redis.instance;
	}

	public setObjectData(key: string, value: object): void {
		this.client.set(key, 'value', value);
	}
}

export default Redis;
