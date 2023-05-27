import express, {
	Request,
	Response,
	ErrorRequestHandler,
	NextFunction,
} from 'express';
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
import v1TestRouter from './lib/routes/testController';

import {
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
} from './lib/middlewares/errors';

// env
dotenv.config();

// 서버 가동
const app = express();

// redis initialize
const redis = Redis.getInstance();

// 로깅용 initialize
const logger = WinstonLogger.getInstance();

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
app.use('/v1', v1TestRouter);

app.use((req, res) => {
	res.status(404).send({ message: 'page not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
	if (err instanceof BadRequestError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof UnauthorizedError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof ForbiddenError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof InternalServerError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof NotFoundError) {
		res.status(err.code).send();
	} else {
		logger.error(err);
		res.status(500).send({ message: 'INTERNAL_SERVER_ERROR' });
	}
});

// error handler
app.use(((err, req, res, next) => {
	res.status(err.status ?? 500).json({
		message: err.message,
		error: err.stack,
	});
}) as ErrorRequestHandler);

export default app;
