import express from 'express';
import { validateOrReject } from 'class-validator';
import StoreService from '../services/storeService';
import checkHeaderToken from '../middlewares/checkHeaderToken';
import CreateStoreDto from '../types/requestTypes/createStore.dto';
import GetStoreDto from '../types/responseTypes/getStore.dto';
import UpdateStoreDto from '../types/requestTypes/updateStore.dto';
import CreateStoreReviewDto from '../types/requestTypes/createStoreReview.dto';
import UpdateStoreReviewDto from '../types/requestTypes/updateStoreReview.dto';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';

const router = express.Router();
const storeService = StoreService.getInstance();

router.post('/store', checkHeaderToken, async (req, res, next) => {
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
});

router.get('/stores/:storeUUID', checkHeaderToken, async (req, res, next) => {
	try {
		const { storeUUID } = req.params;

		if (!storeUUID) {
			throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
		}

		const storeData = await storeService.getStore(req.userUUID, storeUUID);

		const store = new GetStoreDto(storeData);

		res.json({ data: store });
	} catch (error) {
		next(error);
	}
});

router.patch('/stores/:storeUUID', checkHeaderToken, async (req, res, next) => {
	try {
		const { storeUUID } = req.params;

		if (!storeUUID) {
			throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
});

router.delete(
	'/stores/:storeUUID',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const { storeUUID, storeReviewUUID } = req.params;

			if (!storeUUID || !storeReviewUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const { storeUUID, storeReviewUUID } = req.params;

			if (!storeUUID || !storeReviewUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, ['Invalid query']);
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
