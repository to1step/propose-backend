import { faker } from '@faker-js/faker';
import { StoreModel } from '../src/database/models/store';
import { UserModel } from '../src/database/models/user';
import WinstonLogger from '../src/utilies/logger';
import { StoreReviewModel } from '../src/database/models/storeReview';

const logger = WinstonLogger.getInstance();
export const seedingStoreReviews = async () => {
	logger.info('Seeding store reviews...');

	const randomUsers = await UserModel.find();

	const stores = await StoreModel.find();

	await Promise.all(
		stores.map(async (store) => {
			// eslint-disable-next-line no-unreachable-loop

			const randomUser =
				randomUsers[Math.floor(Math.random() * randomUsers.length)];
			const randomUserUUID = randomUser.uuid;
			const uuid = faker.string.uuid();

			return new StoreReviewModel({
				uuid: uuid,
				user: randomUserUUID,
				store: store.uuid,
				review: faker.lorem.sentence(),
			}).save();
		})
	);

	logger.info('Complete seeding store reviews...');
};
