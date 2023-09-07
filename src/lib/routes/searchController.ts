import { NextFunction, Request, Response, Router } from 'express';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import StoreService from '../services/storeService';
import CourseService from '../services/courseService';

const storeService = StoreService.getInstance();
const courseService = CourseService.getInstance();
const router = Router();

router.get(
	'/search/tags',
	// eslint-disable-next-line consistent-return
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { tag, type, page, pageSize } = req.query;

			if (
				!page ||
				!pageSize ||
				typeof page !== 'string' ||
				typeof pageSize !== 'string'
			) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (!tag || typeof tag !== 'string') {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (type === 'store') {
				const data = await storeService.getStoresByTag(
					tag,
					parseInt(page, 10),
					parseInt(pageSize, 10)
				);

				return res.json({ data: data });
			}

			if (type === 'course') {
				const data = await courseService.getCoursesByTag(
					tag,
					parseInt(page, 10),
					parseInt(pageSize, 10)
				);

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
	// eslint-disable-next-line consistent-return
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { keyword, type, page, pageSize } = req.query;

			if (
				!page ||
				!pageSize ||
				typeof page !== 'string' ||
				typeof pageSize !== 'string'
			) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (!keyword || typeof keyword !== 'string') {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (type === 'store') {
				const data = await storeService.getStoresByKeyword(
					keyword,
					parseInt(page, 10),
					parseInt(pageSize, 10)
				);

				return res.json({ data: data });
			}

			if (type === 'course') {
				const data = await courseService.getCoursesByKeyword(
					keyword,
					parseInt(page, 10),
					parseInt(pageSize, 10)
				);

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

export default router;
