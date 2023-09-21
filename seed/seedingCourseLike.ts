import { UserModel } from '../src/database/models/user';
import { CourseModel } from '../src/database/models/course';
import WinstonLogger from '../src/utilies/logger';
import CourseService from '../src/lib/services/courseService';

const courseService = CourseService.getInstance();

const logger = WinstonLogger.getInstance();

export const seedingCourseLike = async () => {
	logger.info('Seeding course like...');

	const users = await UserModel.find();

	const courses = await CourseModel.find();

	for (let i = 0; i < 10000; i += 1) {
		const randomUser = users[Math.floor(Math.random() * users.length)];

		const randomCourse = courses[Math.floor(Math.random() * 1000)];

		// eslint-disable-next-line no-await-in-loop
		await courseService.likeCourse(randomUser.uuid, randomCourse.uuid);
	}

	logger.info('Complete seeding course like...');
};
