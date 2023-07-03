import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import WinstonLogger from './logger';

const logger = WinstonLogger.getInstance();

dotenv.config();

class Mongo {
	private static instance: Mongo;

	private readonly mongoUri: string;

	private readonly connectOption: ConnectOptions;

	constructor() {
		this.mongoUri = `${process.env.DATABASE_URL}`;

		this.connectOption = {
			user: process.env.DATABASE_USER,
			pass: process.env.DATABASE_PASSWORD,
			dbName: process.env.DATABASE_NAME,
			heartbeatFrequencyMS: 2000,
		};
	}

	static getInstance(): Mongo {
		if (!Mongo.instance) {
			Mongo.instance = new Mongo();
		}

		return Mongo.instance;
	}

	async connect(): Promise<void> {
		await mongoose.connect(this.mongoUri, this.connectOption);
		logger.info(`DB Connected`);
	}
}

export default Mongo;
