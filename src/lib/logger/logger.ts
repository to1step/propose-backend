/**
 * @example logger.info("message")
 * @example logger.error("message")
 */

import { createLogger, format, transports } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

// log출력 형식 정의
const logFormat = printf((info) => {
	return `[${info.timestamp}] | [${info.level}] | ${info.message}`; // 날짜 시간 로그레벨: 메세지
});

const infoLog = new WinstonDaily({
	level: 'info',
	datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
	dirname: `${process.cwd()}/logs/info`, // 파일 경로
	filename: `%DATE%.info.log`, // 파일 이름 형식 2020-05-28.info.log
});

const httpLog = new WinstonDaily({
	level: 'http',
	datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
	dirname: `${process.cwd()}/logs/info`, // 파일 경로
	filename: `%DATE%.info.log`, // 파일 이름 형식 2020-05-28.info.log
});

const ErrorLog = new WinstonDaily({
	level: 'error',
	datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
	dirname: `${process.cwd()}/logs/error`, // 파일 경로
	filename: `%DATE%.error.log`, // 파일 이름 형식 2020-05-28.error.log
});

const ExceptionLog = new WinstonDaily({
	level: 'error',
	datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
	dirname: `${process.cwd()}/logs/exception`, // 파일 경로
	filename: `%DATE%.exception.log`, // 파일 이름 형식 2020-05-28.exception.log
});

const terminalLog = new transports.Console({
	format: format.combine(
		format.colorize(), // 색깔 넣어서 출력
		timestamp({ format: Date.now().toString() }),
		logFormat
	),
});

let transport;
let exceptionHandler;
if (process.env.NODE_ENV === 'production') {
	transport = [infoLog, ErrorLog, httpLog];
	exceptionHandler = ExceptionLog;
} else if (process.env.NODE_ENV === 'development') {
	transport = [infoLog, ErrorLog, httpLog];
	exceptionHandler = ExceptionLog;
} else {
	transport = terminalLog;
	exceptionHandler = terminalLog;
}

const logger = createLogger({
	format: combine(timestamp({ format: Date.now().toString() }), logFormat),
	transports: transport,
	exceptionHandlers: exceptionHandler,
});

export { logger };
