import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import Redis from './utilies/redis';
import WinstonLogger from './utilies/logger';
import v1AuthRouter from './lib/routes/authController';
import v1UserRouter from './lib/routes/userController';
import v1StoreRouter from './lib/routes/storeController';
import v1CourseRouter from './lib/routes/courseController';
import v1TestRouter from './lib/routes/testController';
import { errorHandler } from './lib/middlewares/errors/errorHandler';
import { NotFoundError } from './lib/middlewares/errors';
import ErrorBot from './utilies/errorBot';

// env
dotenv.config();

// 서버 가동
const app = express();

// redis initialize
const redis = Redis.getInstance();

// 로깅용 initialize
const logger = WinstonLogger.getInstance();

// discord errorBot
const errorBot = ErrorBot.getInstance();

// swagger 문서
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Connect to MongoDB
(async () => {
	await mongoose.connect(`${process.env.DATABASE_URL}`, {
		user: process.env.DATABASE_USER,
		pass: process.env.DATABASE_PASSWORD,
		dbName: process.env.DATABASE_NAME,
		heartbeatFrequencyMS: 2000,
	});
	logger.info(`DB Connected`);
})();

//Connect to Redis
(async () => {
	await redis.connect();
})();

//Connect to ErrorBot
(async () => {
	await errorBot.connect();
})();

// Express 설정
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.all('/*', (req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});
app.set('port', process.env.PORT || 4000);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		logger.http(`[${req.method}] ${req.url} ${duration}ms`);

		// 2초이상 걸리는 api 로깅
		if (duration > 2000) {
			errorBot.sendMessage(
				'latency',
				`[${req.method}] ${req.url}`,
				req.userUUID ?? null,
				req.ip,
				duration
			);
		}
	});
	next();
});

// health check
app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json('Server working');
});

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, { explorer: true })
);

/**
 * 라우터 정의
 */
app.use('/v1', v1AuthRouter);
app.use('/v1', v1UserRouter);
app.use('/v1', v1StoreRouter);
app.use('/v1', v1CourseRouter);
app.use('/v1', v1TestRouter);

app.use((req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export default app;
