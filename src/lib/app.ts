import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import WintonLogger from './logger/logger';

const app = express();

// 서버 가동
dotenv.config();
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

app.all('/*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
	WintonLogger.getInstance().getLogger().http(`[${req.method}] ${req.url}`);
	next();
});

app.get('/', (req, res, next) => {
	res.json('Server working');
});

(async () => {
	await mongoose.connect(`${process.env.DATABASE_URL}`, {
		user: process.env.DATABASE_USER,
		pass: process.env.DATABASE_PASSWORD,
		dbName: process.env.DATABASE_NAME,
	});
	console.log('db connected!');
})();

app.use((req, res) => {
	return res.status(404).send({ message: 'page not found' });
});

app.listen(4000, () => {
	WintonLogger.getInstance().getLogger().info(`	
	################################################
	🛡️  Server listening on port: 4000🛡️
	################################################
  `);
});
