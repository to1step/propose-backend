import { NextFunction, Request, Response, Router } from 'express';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import SearchService from '../services/searchService';

const searchService = SearchService.getInstance();
const router = Router();

router.get(
	'/search/tags',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { tag, type } = req.query;

			if (!(type === 'course' || type === 'store')) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (!tag || typeof tag !== 'string') {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const data = await searchService.searchByTag(type, tag);

			res.json({ data: data });
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
