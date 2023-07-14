import { Router, Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import StoreService from '../services/storeService';
import checkAccessToken from '../middlewares/checkAccessToken';
import CreateStoreDto from '../types/requestTypes/createStore.dto';
import EntireStoreDto from '../types/responseTypes/entireStore.dto';
import UpdateStoreDto from '../types/requestTypes/updateStore.dto';
import CreateStoreReviewDto from '../types/requestTypes/createStoreReview.dto';
import UpdateStoreReviewDto from '../types/requestTypes/updateStoreReview.dto';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';

const router = Router();
const storeService = StoreService.getInstance();

router.post(
	'/store',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const createStoreDto = new CreateStoreDto(req.body);

			await validateOrReject(createStoreDto);

			await storeService.createStore(
				req.userUUID,
				createStoreDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.get(
	'/stores/:storeUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const storeData = await storeService.getStore(req.userUUID, storeUUID);

			const store = new EntireStoreDto(storeData);

			res.json({ data: store });
		} catch (error) {
			next(error);
		}
	}
);

router.get(
	'/stores/:location/top',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { location } = req.params;

			if (!location) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const store = await storeService.getTopStores(
				decodeURIComponent(location) // 한글은 깨질 수 있으니 encoding한 후 decoding
			);

			res.json({ data: store });
		} catch (error) {
			next(error);
		}
	}
);

router.patch(
	'/stores/:storeUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const updateStoreDto = new UpdateStoreDto(req.body);

			await validateOrReject(updateStoreDto);

			await storeService.updateStore(
				req.userUUID,
				storeUUID,
				updateStoreDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/stores/:storeUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await storeService.removeStore(req.userUUID, storeUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/stores/:storeUUID/like',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await storeService.likeStore(req.userUUID, storeUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/stores/:storeUUID/like',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await storeService.unlikeStore(req.userUUID, storeUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/stores/:storeUUID/review',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const createStoreReviewDto = new CreateStoreReviewDto(req.body);

			await validateOrReject(createStoreReviewDto);

			await storeService.createStoreReview(
				req.userUUID,
				storeUUID,
				createStoreReviewDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.patch(
	'/stores/:storeUUID/reviews/:storeReviewUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID, storeReviewUUID } = req.params;

			if (!storeUUID || !storeReviewUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const updateStoreReviewDto = new UpdateStoreReviewDto(req.body);

			await validateOrReject(updateStoreReviewDto);

			await storeService.updateStoreReview(
				req.userUUID,
				storeUUID,
				storeReviewUUID,
				updateStoreReviewDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/stores/:storeUUID/reviews/:storeReviewUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { storeUUID, storeReviewUUID } = req.params;

			if (!storeUUID || !storeReviewUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await storeService.removeStoreReview(
				req.userUUID,
				storeUUID,
				storeReviewUUID
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
