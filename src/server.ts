import app from './app';
import WinstonLogger from './utilies/logger';
import { rankingScheduler } from './utilies/rankScheduler';

const logger = WinstonLogger.getInstance();

const server = app.listen(app.get('port'), () => {
	rankingScheduler();
	logger.info(`🛡️  Server listening on port: ${app.get('port')}🛡️`);
});

export default server;
