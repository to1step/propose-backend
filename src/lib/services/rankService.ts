import Redis from '../../utilies/redis';
import { Store, Course } from '../types/type';
import { StoreModel } from '../../database/models/store';
import ModelConverter from '../../utilies/converter/modelConverter';
import { CourseModel } from '../../database/models/course';

const redis = Redis.getInstance().getClient();

class RankService {
	private static instance: RankService;

	private constructor() {}

	public static getInstance(): RankService {
		if (!RankService.instance) {
			RankService.instance = new RankService();
		}
		return RankService.instance;
	}

	/**
	 * 자신 주위의 ranking에 등재된 5개의 store or course 가져오기
	 * @param location
	 * @param type
	 */
	async getTop(
		location: string,
		type: 'store' | 'course'
	): Promise<Store[] | Course[]> {
		// store
		if (type === 'store') {
			const storeUUIDs = await redis.lRange(location, 0, -1);

			const topStores = await StoreModel.find({
				uuid: { $in: storeUUIDs },
				deletedAt: null,
			});

			return topStores.map((topStore) => {
				return ModelConverter.toStore(topStore);
			});
		}

		// course
		const courseUUIDs = await redis.lRange('top-course', 0, -1);

		const topCourses = await CourseModel.find({
			uuid: { $in: courseUUIDs },
			deletedAt: null,
		});

		return topCourses.map((topCourse) => {
			return ModelConverter.toCourse(topCourse);
		});
	}
}

export default RankService;
