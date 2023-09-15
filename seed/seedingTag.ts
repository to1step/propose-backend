import { tagData } from './tagData';
import { StoreTagModel } from '../src/database/models/storeTag';
import { CourseTagModel } from '../src/database/models/courseTag';
import WinstonLogger from '../src/utilies/logger';

const logger = WinstonLogger.getInstance();

export const seedingTags = async () => {
	tagData.map(async (tag) => {
		await Promise.all([
			new StoreTagModel({
				tag: tag,
				stores: [],
			}).save(),
			new CourseTagModel({
				tag: tag,
				courses: [],
			}).save(),
		]);
	});

	logger.info('Complete seeding tags');
};
