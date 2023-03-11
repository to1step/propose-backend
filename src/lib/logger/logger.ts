import { createLogger, format, transports } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const notLocal =
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'development';

// log출력 형식 정의
const logFormat = printf((info) => {
	return `[${info.timestamp}] | [${info.level}] | ${info.message}`; // 날짜 시간 로그레벨: 메세지
});

const logFile = (level: string, directory: string) => {
	return new WinstonDaily({
		level: `${level}`,
		datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
		dirname: `${process.cwd()}/logs/${directory}`, // 파일 경로
		filename: `%DATE%.${directory}.log`, // 파일 이름 형식 2020-05-28.info.log
		maxFiles: 30, // 최근 30일치 로그 파일을 남김
		handleExceptions: true,
	});
};

const logTerminal = new transports.Console({
	format: format.combine(
		format.colorize(), // 색깔 넣어서 출력
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		logFormat
	),
	handleExceptions: true,
});

const logger = createLogger({
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
	exitOnError: false,
	transports: notLocal
		? [logFile('info', 'info'), logFile('error', 'error')]
		: logTerminal,
	exceptionHandlers: notLocal ? [logFile('error', 'exception')] : logTerminal,
});

export { logger };
