import { NextFunction, Request, Response, Router } from 'express';
import checkAccessToken from '../middlewares/checkAccessToken';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import StoreService from '../services/storeService';

const storeService = StoreService.getInstance();
const router = Router();

router.get(
	'/rank',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type, region } = req.query;

			if (!(type === 'course' || type === 'store')) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			if (!region || typeof region !== 'string') {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const store = await storeService.getTop(region, type);

			res.json({ data: store });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
