import { NextFunction, Request, Response, Router } from 'express';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import SearchService from '../services/searchService';
import StoreService from '../services/storeService';
import CourseService from '../services/courseService';

const storeService = StoreService.getInstance();
const courseService = CourseService.getInstance();
const searchService = SearchService.getInstance();
const router = Router();

router.get(
	'/search/tags',
	// eslint-disable-next-line consistent-return
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { tag, type } = req.query;

			if (!tag || typeof tag !== 'string') {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (type === 'store') {
				const data = await storeService.getStoresByTag(tag);

				return res.json({ data: data });
			}

			if (type === 'course') {
				const data = await courseService.getCoursesByTag(tag);

				return res.json({ data: data });
			}

			throw new BadRequestError(ErrorCode.INVALID_QUERY, [
				{ data: 'Invalid query' },
			]);
		} catch (error) {
			next(error);
		}
	}
);

router.get(
	'/search/keyword',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { keyword, type } = req.query;

			if (!(type === 'course' || type === 'store')) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (!keyword || typeof keyword !== 'string') {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const data = await searchService.searchByKeyword(type, keyword);

			res.json({ data: data });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
