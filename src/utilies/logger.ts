import { createLogger, format, transports, Logger } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const logFormat = format.printf((info) => {
	return `[${info.timestamp}] [${info.level}] : ${info.message}`; // 날짜 시간 로그레벨: 메세지
});

class WinstonLogger {
	private static instance: WinstonLogger;

	private readonly logger: Logger;

	private readonly logPath: string;

	private constructor() {
		this.logPath = `${process.env.LOG_PATH}`;

		const infoLog = new WinstonDaily({
			level: 'info',
			datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
			dirname: `${this.logPath}/info`, // 파일 경로
			filename: `%DATE%.info.log`, // 파일 이름 형식 2020-05-28.info.log
		});

		const httpLog = new WinstonDaily({
			level: 'http', // http 보다 낮은애들은 모두 파일에 저장
			datePattern: 'YYYY-MM-DD',
			dirname: `${this.logPath}/http`,
			filename: `%DATE%.http.log`,
		});

		const errorLog = new WinstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: `${this.logPath}/error`,
			filename: `%DATE%.error.log`,
		});

		const exceptionLog = new WinstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: `${this.logPath}/exception`,
			filename: `%DATE%.exception.log`,
		});

		const terminalLog = new transports.Console({
			level: 'debug',
			format: format.combine(format.colorize(), format.timestamp(), logFormat),
		});

		let transport;
		let exceptionHandler;
		if (process.env.NODE_ENV === 'production') {
			transport = [infoLog, errorLog, httpLog, terminalLog];
			exceptionHandler = [exceptionLog, terminalLog];
		} else if (process.env.NODE_ENV === 'development') {
			transport = [infoLog, errorLog, httpLog, terminalLog];
			exceptionHandler = [exceptionLog, terminalLog];
		} else {
			transport = terminalLog;
			exceptionHandler = terminalLog;
		}

		this.logger = createLogger({
			format: format.combine(format.timestamp(), logFormat),
			transports: transport,
			exceptionHandlers: exceptionHandler,
		});
	}

	static getInstance(): WinstonLogger {
		if (!WinstonLogger.instance) {
			WinstonLogger.instance = new WinstonLogger();
		}
		return WinstonLogger.instance;
	}

	info(message: string) {
		this.logger.info(message);
	}

	error(message: string) {
		this.logger.error(message);
	}

	http(message: string) {
		this.logger.http(message);
	}
}

export default WinstonLogger;
