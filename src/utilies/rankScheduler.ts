import { StoreScoreModel } from '../database/models/storeScore';
import Redis from './redis';

const redis = Redis.getInstance().getClient();

const getTopScore = async () => {
	const now = new Date();
	const day = now.getDay();
	const diff = now.getDate() - day + (day === 0 ? -6 : 1);
	const monday = new Date(now.setDate(diff));
	monday.setHours(0, 0, 0, 0);

	const stores = await StoreScoreModel.aggregate([
		{ $match: { date: monday } },
		{ $sort: { score: -1 } },
		{
			$group: {
				_id: '$shortLocation',
				data: { $push: '$$ROOT' },
			},
		},
		{
			$project: {
				shortLocation: '$_id',
				_id: 0,
				data: { $slice: ['$data', 5] },
			},
		},
		{ $unwind: '$data' },
	]);

	stores.map(async (store) => {
		await redis.rPush(store.shortLocation, store.data.store);
	});
};

export { getTopScore };
