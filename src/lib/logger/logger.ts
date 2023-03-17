import { createLogger, format, transports, Logger } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const logFormat = printf((info) => {
	return `[${info.timestamp}] [${info.level}] : ${info.message}`; // 날짜 시간 로그레벨: 메세지
});

class WintonLogger {
	private static instance: WintonLogger;

	private logger: Logger;

	private constructor() {
		const infoLog = new WinstonDaily({
			level: 'info',
			datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
			dirname: `${process.cwd()}/logs/info`, // 파일 경로
			filename: `%DATE%.info.log`, // 파일 이름 형식 2020-05-28.info.log
		});

		const httpLog = new WinstonDaily({
			level: 'http', // http보다 낮은애들은 모두 파일에 저장
			datePattern: 'YYYY-MM-DD',
			dirname: `${process.cwd()}/logs/http`,
			filename: `%DATE%.info.log`,
		});

		const errorLog = new WinstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: `${process.cwd()}/logs/error`,
			filename: `%DATE%.error.log`,
		});

		const exceptionLog = new WinstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: `${process.cwd()}/logs/exception`,
			filename: `%DATE%.exception.log`,
		});

		const terminalLog = new transports.Console({
			level: 'debug',
			format: format.combine(
				format.colorize(),
				timestamp({ format: Date.now().toString() }),
				logFormat
			),
		});

		let transport;
		let exceptionHandler;
		if (process.env.NODE_ENV === 'production') {
			transport = [infoLog, errorLog, httpLog];
			exceptionHandler = exceptionLog;
		} else if (process.env.NODE_ENV === 'development') {
			transport = [infoLog, errorLog, httpLog];
			exceptionHandler = exceptionLog;
		} else {
			transport = terminalLog;
			exceptionHandler = terminalLog;
		}

		this.logger = createLogger({
			format: combine(timestamp({ format: Date.now().toString() }), logFormat),
			transports: transport,
			exceptionHandlers: exceptionHandler,
		});
	}

	public static getInstance(): WintonLogger {
		if (!WintonLogger.instance) {
			WintonLogger.instance = new WintonLogger();
		}
		return WintonLogger.instance;
	}

	public getLogger(): Logger {
		return this.logger;
	}
}

export default WintonLogger;
