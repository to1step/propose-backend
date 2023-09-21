import mongoose from 'mongoose';
import request from 'supertest';

describe('setup db', () => {
	beforeAll(async () => {
		const mongoUri = `${process.env.TEST_DATABASE_URL}`;

		const connectOption = {
			user: process.env.TEST_DATABASE_USER,
			pass: process.env.TEST_DATABASE_PASSWORD,
			dbName: process.env.TEST_DATABASE_NAME,
			heartbeatFrequencyMS: 2000,
		};

		await mongoose
			.connect(mongoUri, connectOption)
			.then(() => console.log('MongoDB conected...'))
			.catch((err) => {
				console.log(err);
			});
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});
