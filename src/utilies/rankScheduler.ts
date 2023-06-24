import schedule from 'node-schedule';
import { StoreScoreModel } from '../database/models/storeScore';
import Redis from './redis';
import WinstonLogger from './logger';
import { LocationAggregateStore } from '../lib/types/type';

const logger = WinstonLogger.getInstance();

const redis = Redis.getInstance().getClient();

const getTopScore = (): void => {
	// 매주 일요일 11시 50분에 이벤트 발생
	const rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = 0;
	rule.hour = 23;
	rule.minute = 50;

	schedule.scheduleJob(rule, async () => {
		try {
			const now = new Date();
			const day = now.getDay();
			const diff = now.getDate() - day + (day === 0 ? -6 : 1);
			const monday = new Date(now.setDate(diff));
			monday.setHours(0, 0, 0, 0);

			// 이번주의 지역마다(구) 상위 5개 가게들을 가져오기
			const stores: LocationAggregateStore[] = await StoreScoreModel.aggregate([
				{ $match: { date: monday } }, // 이번주에 대한 데이터 get
				{ $sort: { score: -1 } }, // score로 내림차순 정렬
				{
					$group: {
						_id: '$shortLocation', // shortLocation으로 그룹화
						data: { $push: '$$ROOT' },
					},
				},
				{
					$project: {
						shortLocation: '$_id', // _id를 shortLocation으로 변경
						_id: 0, // _id field 삭제
						data: { $slice: ['$data', 5] }, // 상위 5개 추출
					},
				},
				{ $unwind: '$data' },
			]);

			// 가져온 데이터들을 redis에 삽입
			stores.map(async (store: LocationAggregateStore) => {
				await redis.del(store.shortLocation); // 먼저 지난 번의 데이터 모두 삭제
				await redis.rPush(store.shortLocation, store.data.store);
			});

			logger.info('Top stores saved on redis');
		} catch (err: any) {
			const errorMessage = err.stack.toString();

			logger.error(errorMessage);
		}
	});
};

export { getTopScore };
