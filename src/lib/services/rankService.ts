/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
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
	 * @param region
	 * @param type
	 */
	async getTop(
		type: 'store' | 'course',
		region?: string
	): Promise<Store[] | Course[]> {
		// store
		if (type === 'store') {
			const storeUUIDs = await redis.lRange(region!, 0, -1);

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

		// TODO: 진짜 미안하다.. 이게 최선이었다..
		const result: any[] = [];
		for (const key in topCourses) {
			const topCourse = topCourses[key];
			const course = ModelConverter.toCourse(topCourse);

			const storeNames: any = [];
			const storeName = await StoreModel.find({
				uuid: { $in: course.stores },
			});

			storeName.forEach((store) => {
				storeNames.push({
					uuid: store.uuid,
					name: store.name,
					category: store.category,
					description: store.description,
					coordinates: store.coordinates,
					location: store.location,
					shortLocation: store.shortLocation,
					representImage: store.representImage,
					tags: store.tags,
					startTime: store.startTime,
					endTime: store.endTime,
				});
			});

			result.push({
				...course,
				stores: storeNames,
			});
		}

		return result;
	}
}

export default RankService;
