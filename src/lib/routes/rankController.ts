import { NextFunction, Request, Response, Router } from 'express';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import RankService from '../services/rankService';

const rankService = RankService.getInstance();
const router = Router();

router.get('/rank', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { type } = req.query;
		const region = req.query.region as string;

		// 여기 로직 수정
		if (!(type === 'course' || type === 'store')) {
			throw new BadRequestError(ErrorCode.INVALID_QUERY, [
				{ data: 'Invalid query' },
			]);
		}

		if (type === 'store' && !region) {
			throw new BadRequestError(ErrorCode.INVALID_QUERY, [
				{ data: 'Invalid query' },
			]);
		}

		const store = await rankService.getTop(type, region);

		res.json({ data: store });
	} catch (error) {
		next(error);
	}
});

export default router;
