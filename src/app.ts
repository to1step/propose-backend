import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import Mongo from './utilies/mongo';
import Redis from './utilies/redis';
import ErrorBot from './utilies/errorBot';
import WinstonLogger from './utilies/logger';
import v1AuthRouter from './lib/routes/authController';
import v1UserRouter from './lib/routes/userController';
import v1StoreRouter from './lib/routes/storeController';
import v1CourseRouter from './lib/routes/courseController';
import v1RankRouter from './lib/routes/rankController';
import v1SearchRouter from './lib/routes/searchController';
import v1TestRouter from './lib/routes/testController';
import { errorHandler } from './lib/middlewares/errors/errorHandler';
import { NotFoundError } from './lib/middlewares/errors';
import { needEnv } from './utilies/envList';
import { seedingStores } from '../seed/seedingStore';
import { seedingUsers } from '../seed/seedingUser';
import { seedingCourses } from '../seed/seedingCourses';
import { seedingStoreReviews } from '../seed/seedingStoreReview';
import { seedingCourseReviews } from '../seed/seedingCourseReview';
import { seedingStoreLike } from '../seed/seedingStoreLike';
import { seedingCourseLike } from '../seed/seedingCourseLike';
import { seedingTags } from '../seed/seedingTag';

dotenv.config();

const app = express();

const mongo = Mongo.getInstance();

const redis = Redis.getInstance();

const logger = WinstonLogger.getInstance();

const errorBot = ErrorBot.getInstance();

const swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'));

(() => {
	const missingVariables: string[] = [];

	needEnv.forEach((envVariable) => {
		if (!process.env[envVariable]) {
			missingVariables.push(envVariable);
		}
	});

	if (missingVariables.length > 0) {
		missingVariables.forEach((variable) => {
			logger.error(`${variable} is missing`);
		});
		process.exit(1);
	} else {
		logger.info('All required environment variables are present.');
	}
})();

// Connect Database
(async () => {
	if (process.env.NODE_ENV !== 'test') {
		await mongo.connect();

		await errorBot.connect();
	}

	await redis.connect();
})();

// seeding
// (async () => {
// 	await seedingTags();
// 	await seedingUsers(1000);
// 	await seedingStores(10000);
// 	await seedingCourses(10000);
// 	await Promise.all([seedingStoreReviews(), seedingCourseReviews()]);
// 	await Promise.all([seedingStoreLike(), seedingCourseLike()]);
// })();

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

		// check exceed 2000ms api
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

// health-check
app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json('Server working');
});

// docs-route
app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, { explorer: true })
);

// api-routes
app.use('/v1', v1AuthRouter);
app.use('/v1', v1UserRouter);
app.use('/v1', v1StoreRouter);
app.use('/v1', v1CourseRouter);
app.use('/v1', v1RankRouter);
app.use('/v1', v1SearchRouter);
app.use('/v1', v1TestRouter);

// page not found
app.use((req, res) => {
	throw new NotFoundError();
});

// error-handler
app.use(errorHandler);

export { app };
