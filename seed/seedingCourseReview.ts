import { faker } from '@faker-js/faker';
import { UserModel } from '../src/database/models/user';
import { CourseModel } from '../src/database/models/course';
import WinstonLogger from '../src/utilies/logger';
import { CourseReviewModel } from '../src/database/models/courseReview';

const logger = WinstonLogger.getInstance();
export const seedingCourseReviews = async () => {
	logger.info('Seeding course reviews...');

	const randomUsers = await UserModel.find();

	const courses = await CourseModel.find();

	await Promise.all(
		courses.map(async (course) => {
			const uuid = faker.string.uuid();
			const randomUser =
				randomUsers[Math.floor(Math.random() * randomUsers.length)];
			const randomUserUUID = randomUser.uuid;

			return new CourseReviewModel({
				uuid: uuid,
				user: randomUserUUID,
				course: course.uuid,
				review: faker.lorem.sentence(),
			}).save();
		})
	);

	logger.info('Complete seeding course reviews...');
};
