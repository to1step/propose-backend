import { Course, Store } from '../types/type';
import { StoreModel } from '../../database/models/store';
import ModelConverter from '../../utilies/converter/modelConverter';
import { CourseModel } from '../../database/models/course';

class SearchService {
	private static instance: SearchService;

	constructor() {}

	/**
	 * 태그로 가게 / 코스 검색
	 * @param type
	 * @param tag
	 */
	async searchByTag(
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

	/**
	 * keyword로 가게 / 코스 검색
	 * @param type
	 * @param keyword
	 */
	async searchByKeyword(
		type: 'store' | 'course',
		keyword: string
	): Promise<Store[] | Course[]> {
		// store
		if (type === 'store') {
			const stores = await StoreModel.find({ name: { $regex: keyword } });

			return stores.map((store) => ModelConverter.toStore(store));
		}

		// course
		const courses = await CourseModel.find({ name: { $regex: keyword } });

		return courses.map((course) => ModelConverter.toCourse(course));
	}

	public static getInstance(): SearchService {
		if (!SearchService.instance) {
			SearchService.instance = new SearchService();
		}
		return SearchService.instance;
	}
}

export default SearchService;
