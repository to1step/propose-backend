import { faker } from '@faker-js/faker';
import { tagData } from './tagData';
import { StoreModel } from '../src/database/models/store';
import { UserModel } from '../src/database/models/user';
import WinstonLogger from '../src/utilies/logger';
import { CourseModel } from '../src/database/models/course';
import { StoreTagModel } from '../src/database/models/storeTag';
import { CourseTagModel } from '../src/database/models/courseTag';

const logger = WinstonLogger.getInstance();
export const seedingCourses = async (numbers: number) => {
	logger.info('Seeding courses...');

	const courseDatas = [];

	const randomUsers = await UserModel.find();

	const randomStore = await StoreModel.find();

	for (let i = 1; i <= numbers; i += 1) {
		courseDatas.push(i);
	}

	courseDatas.map(async () => {
		const randomUser =
			randomUsers[Math.floor(Math.random() * randomUsers.length)];
		const randomStores = [
			randomStore[Math.floor(Math.random() * randomStore.length)],
			randomStore[Math.floor(Math.random() * randomStore.length)],
			randomStore[Math.floor(Math.random() * randomStore.length)],
			randomStore[Math.floor(Math.random() * randomStore.length)],
		];

		const randomUserUUID = randomUser.uuid;
		const uuid = faker.string.uuid();
		const randomStoresUUID = [
			randomStores[0].uuid,
			randomStores[1].uuid,
			randomStores[2].uuid,
			randomStores[3].uuid,
		];
		const name = `${randomUser.nickname}의 코스`;
		const representImage = faker.image.url();
		const shortComment = faker.lorem.sentence();
		const longComment = faker.lorem.sentence();
		const transports = [
			{
				startStore: randomStores[0].uuid,
				endStore: randomStores[1].uuid,
				comment: faker.lorem.sentence(),
				transportation: Math.floor(Math.random() * 3),
			},
			{
				startStore: randomStores[1].uuid,
				endStore: randomStores[2].uuid,
				comment: faker.lorem.sentence(),
				transportation: Math.floor(Math.random() * 3),
			},
			{
				startStore: randomStores[2].uuid,
				endStore: randomStores[3].uuid,
				comment: faker.lorem.sentence(),
				transportation: Math.floor(Math.random() * 3),
			},
		];
		const tags = [
			tagData[Math.floor(Math.random() * tagData.length)],
			tagData[Math.floor(Math.random() * tagData.length)],
			tagData[Math.floor(Math.random() * tagData.length)],
		];

		tags.map(async (tag) => {
			const tagDatas = await CourseTagModel.findOne({ tag: tag });

			if (tagDatas) {
				tagDatas.courses.push(uuid);

				await tagDatas.save();
			}
		});

		return new CourseModel({
			uuid: uuid,
			user: randomUserUUID,
			userName: faker.internet.userName(),
			name: name,
			stores: randomStoresUUID,
			representImage: representImage,
			shortComment: shortComment,
			longComment: longComment,
			transports: transports,
			tags: tags,
			isPrivate: false,
		}).save();
	});

	logger.info('Complete seeding courses');
};
