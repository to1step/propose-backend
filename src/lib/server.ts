import WintonLogger from './logger/logger';
import app from './app';

const logger = WintonLogger.getInstance().getLogger();

const server = app.listen(app.get('port'), () => {
	logger.info(`🛡️  Server listening on port: ${app.get('port')}🛡️`);
});

export default server;
