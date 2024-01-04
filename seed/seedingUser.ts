import { faker } from '@faker-js/faker';
import { UserModel } from '../src/database/models/user';
import WinstonLogger from '../src/utilies/logger';

const logger = WinstonLogger.getInstance();

export const seedingUsers = async (numbers: number) => {
	const userDatas = [];

	logger.info('Seeding user..');
	for (let i = 1; i <= numbers; i += 1) {
		userDatas.push(i);
	}

	userDatas.map(async () => {
		const uuid = faker.string.uuid();
		const userName = faker.internet.userName();
		const email = faker.internet.email();
		const password = faker.internet.password();
		const nickname = faker.internet.userName();
		const provider = 'local';
		const profileImage = faker.image.avatar();
		const commentAlarm = true;
		const updateAlarm = true;

		await new UserModel({
			uuid: uuid,
			email: email,
			password: password,
			nickname: nickname,
			provider: provider,
			profileImage: profileImage,
			commentAlarm: commentAlarm,
			updateAlarm: updateAlarm,
		}).save();
	});

	logger.info('Complete seeding users');
};
