// server-listen
import { app } from './app';
import WinstonLogger from './utilies/logger';

const logger = WinstonLogger.getInstance();

app.listen(app.get('port'), () => {
	logger.info(`Server is running on port ${app.get('port')}`);
});
