import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

dotenv.config();

class Elastic {
	private static instance: Elastic;

	private readonly client: Client;

	constructor() {
		this.client = this.connect();
	}

	static getInstance(): Elastic {
		if (!Elastic.instance) {
			Elastic.instance = new Elastic();
		}

		return Elastic.instance;
	}

	connect(): Client {
		const client = new Client({ node: `${process.env.ELASTIC_URL}` });

		if (client) {
			logger.info('Elastic Connected');
		} else {
			logger.info("Can't find Elastic");
		}

		return client;
	}

	getClient(): Client {
		return this.client;
	}
}

export default Elastic;
