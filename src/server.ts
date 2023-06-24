import app from './app';
import WinstonLogger from './utilies/logger';
import { getTopScore } from './utilies/rankScheduler';

const logger = WinstonLogger.getInstance();

const server = app.listen(app.get('port'), () => {
	getTopScore();
	logger.info(`🛡️  Server listening on port: ${app.get('port')}🛡️`);
});

export default server;
