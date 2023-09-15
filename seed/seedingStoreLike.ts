import { StoreModel } from '../src/database/models/store';
import { UserModel } from '../src/database/models/user';
import WinstonLogger from '../src/utilies/logger';
import StoreService from '../src/lib/services/storeService';

const storeService = StoreService.getInstance();

const logger = WinstonLogger.getInstance();
export const seedingStoreLike = async () => {
	logger.info('Seeding store like...');

	const users = await UserModel.find();

	const stores = await StoreModel.find();

	for (let i = 0; i < 10000; i += 1) {
		const randomUser = users[Math.floor(Math.random() * users.length)];

		const randomStore = stores[Math.floor(Math.random() * 1000)];

		// eslint-disable-next-line no-await-in-loop
		await storeService.likeStore(randomUser.uuid, randomStore.uuid);
	}

	logger.info('Complete seeding store like...');
};
