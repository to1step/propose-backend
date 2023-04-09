import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import Redis from './utilies/redis';
import WinstonLogger from './utilies/logger';
import v1AuthRouter from './lib/routes/authController';
import v1UserRouter from './lib/routes/userController';

const redis = Redis.getInstance();

// 로깅용 initialize
const logger = WinstonLogger.getInstance();
// 서버 가동
const app = express();

// env
dotenv.config();

// Connect to MongoDB
(async () => {
	await mongoose.connect(`${process.env.DATABASE_URL}`, {
		user: process.env.DATABASE_USER,
		pass: process.env.DATABASE_PASSWORD,
		dbName: process.env.DATABASE_NAME,
	});
	logger.info(`DB Connected`);
})();

//Connect to Redis
(async () => {
	await redis.connect();
})();

// Express 설정
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.all('/*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});
app.set('port', process.env.PORT || 4000);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
	logger.http(`[${req.method}] ${req.url}`);
	next();
});
// health check
app.get('/', (req, res, next) => {
	res.json('Server working');
});

/**
 * 라우터 정의
 */
app.use('/v1', v1AuthRouter);
app.use('/v1', v1UserRouter);
app.use((req, res) => {
	res.status(404).send({ message: 'page not found' });
});

// error handler
app.use(((err, req, res, next) => {
	res.status(err.status ?? 500).json({
		message: err.message,
		error: err,
	});
}) as ErrorRequestHandler);

export default app;
