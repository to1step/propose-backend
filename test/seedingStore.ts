import { faker } from '@faker-js/faker';
import { locationData } from './locationData';
import { tagData } from './tagData';
import { getRandomCoordinates } from './coordinateData';
import { StoreModel } from '../src/database/models/store';
import { UserModel } from '../src/database/models/user';
import WinstonLogger from '../src/utilies/logger';

const logger = WinstonLogger.getInstance();
export const seedingStores = async (numbers: number) => {
	const storeDatas = [];

	logger.info('Seeding stores...');
	const users = await UserModel.find();

	for (let i = 1; i <= numbers; i += 1) {
		storeDatas.push(i);
	}

	storeDatas.map(async () => {
		const user = users[Math.floor(Math.random() * users.length)].uuid;
		const uuid = faker.string.uuid();
		const name = faker.commerce.department();
		const category = Math.floor(Math.random() * 3);
		const description = faker.lorem.sentence();
		const location =
			locationData[Math.floor(Math.random() * locationData.length)];
		const shortLocation = location.split(' ').slice(0, 2).join(' ');
		const coordinates = [
			getRandomCoordinates(124, 132),
			getRandomCoordinates(33, 43),
		];
		const representImage = faker.image.url();
		const tags = [
			tagData[Math.floor(Math.random() * tagData.length)],
			tagData[Math.floor(Math.random() * tagData.length)],
			tagData[Math.floor(Math.random() * tagData.length)],
		];

		return new StoreModel({
			user: user,
			uuid: uuid,
			name: name,
			category: category,
			description: description,
			location: location,
			shortLocation: shortLocation,
			coordinates: coordinates,
			representImage: representImage,
			tags: tags,
			startTime: '오전 10시',
			endTime: '오후 10시',
			allowed: true,
		}).save();
	});

	logger.info('Complete seeding stores');
};
