import { NextFunction, Request, Response, Router } from 'express';
import checkAccessToken from '../middlewares/checkAccessToken';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import TagService from '../services/tagService';

const tagService = TagService.getInstance();
const router = Router();

router.get(
	'/tags',
	checkAccessToken,
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

			const data = await tagService.getByTag(type, tag);

			res.json({ data: data });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
