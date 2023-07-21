import { Course, Store } from '../types/type';
import { StoreModel } from '../../database/models/store';
import ModelConverter from '../../utilies/converter/modelConverter';
import { CourseModel } from '../../database/models/course';

class TagService {
	private static instance: TagService;

	constructor() {}

	/**
	 * 태그로 가게 / 코스 검색
	 * @param type
	 * @param tag
	 */
	async getByTag(
		type: 'store' | 'course',
		tag: string
	): Promise<Store[] | Course[]> {
		// store
		if (type === 'store') {
			const stores = await StoreModel.find({ tags: tag });

			return stores.map((store) => ModelConverter.toStore(store));
		}

		// course
		const courses = await CourseModel.find({ tags: tag });

		return courses.map((course) => ModelConverter.toCourse(course));
	}

	public static getInstance(): TagService {
		if (!TagService.instance) {
			TagService.instance = new TagService();
		}
		return TagService.instance;
	}
}

export default TagService;
