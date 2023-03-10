import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = Winston.format;

const logDir = `${process.cwd()}/logs`; //  root/logs폴더에 로그를 쌓이게 함

// log출력 형식 정의
const logFormat = printf(({ level, message, time }) => {
	return `${time} ${level}: ${message}`; // 날짜 시간 로그레벨: 메세지
});

const logger = Winston.createLogger({
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),

	transports:
		process.env.NODE_ENV === 'production' // 배포시에는 파일로 만들기 & 개발시에는 콘솔에 찍어주기
			? [
					// info 레벨 로그를 root/logs/info에 저장
					new WinstonDaily({
						level: 'info',
						datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
						dirname: `${logDir}/info`, // 파일 경로
						filename: `%DATE%.info.log`, // 파일 이름 형식 2020-05-28.info.log
						maxFiles: 30, // 최근 30일치 로그 파일을 남김
					}),
					// error 레벨 로그를 root/logs/error에 저장
					new WinstonDaily({
						level: 'error',
						datePattern: 'YYYY-MM-DD',
						dirname: `${logDir}/error`,
						filename: `%DATE%.error.log`, // 파일 이름 형식 2020-05-28.error.log
						maxFiles: 30,
					}),
			  ]
			: [
					new Winston.transports.Console({
						format: Winston.format.combine(
							Winston.format.colorize(), // 색깔 넣어서 출력
							timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
							logFormat
						),
					}),
			  ],

	// try-catch의 error를 로그를 root/logs/exception에 저장
	exceptionHandlers:
		process.env.NODE_ENV === 'production'
			? new WinstonDaily({
					level: 'error',
					datePattern: 'YYYY-MM-DD',
					dirname: `${logDir}/exception`,
					filename: `%DATE%.exception.log`, // 파일 이름 형식 2020-05-28.error.log
					maxFiles: 30,
			  })
			: new Winston.transports.Console({
					format: Winston.format.combine(
						Winston.format.colorize(), // 색깔 넣어서 출력
						timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
						logFormat
					),
			  }),
});

export { logger };
