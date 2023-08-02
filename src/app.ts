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
import v1TagRouter from './lib/routes/tagController';
import v1TestRouter from './lib/routes/testController';
import { errorHandler } from './lib/middlewares/errors/errorHandler';
import { NotFoundError } from './lib/middlewares/errors';
import { needEnv } from './utilies/envList';
import { seedingStores } from '../test/seedingStore';
import { seedingUsers } from '../test/seedingUser';
import { seedingCourses } from '../test/seedingCourses';
import { seedingStoreReviews } from '../test/seedingStoreReview';
import { seedingCourseReviews } from '../test/seedingCourseReview';
import { seedingStoreLike } from '../test/seedingStoreLike';
import { seedingCourseLike } from '../test/seedingCourseLike';

dotenv.config();

class Server {
	private app = express();

	private mongo = Mongo.getInstance();

	private redis = Redis.getInstance();

	private logger = WinstonLogger.getInstance();

	private errorBot = ErrorBot.getInstance();

	private swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'));

	constructor() {
		this.validateEnv();
		this.initializeDatabase();
		this.initializeRedis();
		this.initializeErrorBot();
		this.initializeMiddleware();
		this.initializeRoutes();
		// this.seeding();
	}

	private validateEnv() {
		const missingVariables: string[] = [];

		needEnv.forEach((envVariable) => {
			if (!process.env[envVariable]) {
				missingVariables.push(envVariable);
			}
		});

		if (missingVariables.length > 0) {
			missingVariables.forEach((variable) => {
				this.logger.error(`${variable} is missing`);
			});
			process.exit(1);
		} else {
			this.logger.info('All required environment variables are present.');
		}
	}

	private async initializeDatabase() {
		await this.mongo.connect();
	}

	private async initializeRedis() {
		await this.redis.connect();
	}

	private async initializeErrorBot() {
		await this.errorBot.connect();
	}

	private async seeding() {
		// await seedingUsers(1000);
		// await seedingStores(10000);
		// await seedingCourses(10000);
		// await seedingStoreReviews();
		// await seedingCourseReviews();
		// await seedingStoreLike();
		// await seedingCourseLike();
	}

	private initializeMiddleware() {
		this.app.use(
			cors({
				origin: true,
				credentials: true,
			})
		);
		this.app.all('/*', (req: Request, res: Response, next: NextFunction) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'X-Requested-With');
			next();
		});
		this.app.set('port', process.env.PORT || 4000);
		this.app.use(helmet({ contentSecurityPolicy: false }));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}

	private initializeRoutes(): void {
		// api time checker
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			const start = Date.now();
			res.on('finish', () => {
				const duration = Date.now() - start;
				this.logger.http(`[${req.method}] ${req.url} ${duration}ms`);

				// check exceed 2000ms api
				if (duration > 2000) {
					this.errorBot.sendMessage(
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
		this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
			res.json('Server working');
		});

		// docs-route
		this.app.use(
			'/api-docs',
			swaggerUi.serve,
			swaggerUi.setup(this.swaggerSpec, { explorer: true })
		);

		// api-routes
		this.app.use('/v1', v1AuthRouter);
		this.app.use('/v1', v1UserRouter);
		this.app.use('/v1', v1StoreRouter);
		this.app.use('/v1', v1CourseRouter);
		this.app.use('/v1', v1RankRouter);
		this.app.use('/v1', v1TagRouter);
		this.app.use('/v1', v1TestRouter);

		// page not found
		this.app.use((req, res) => {
			throw new NotFoundError();
		});

		// error-handler
		this.app.use(errorHandler);
	}

	// server-listen
	public listen(): void {
		this.app.listen(this.app.get('port'), () => {
			this.logger.info(`Server is running on port ${this.app.get('port')}`);
		});
	}
}

try {
	const appServer = new Server();

	appServer.listen();
} catch (error) {
	console.error(error);
}
