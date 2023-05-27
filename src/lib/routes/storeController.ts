import express from 'express';
import { validateOrReject } from 'class-validator';
import StoreService from '../services/storeService';
import checkHeaderToken from '../middlewares/checkHeaderToken';
import CreateStoreDto from '../types/requestTypes/createStore.dto';
import GetStoreDto from '../types/responseTypes/getStore.dto';
import UpdateStoreDto from '../types/requestTypes/updateStore.dto';
import CreateStoreReviewDto from '../types/requestTypes/createStoreReview.dto';
import UpdateStoreReviewDto from '../types/requestTypes/updateStoreReview.dto';

const router = express.Router();
const storeService = StoreService.getInstance();

router.post('/store', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const createStoreDto = new CreateStoreDto(req.body);

		await validateOrReject(createStoreDto);

		await storeService.createStore(
			createStoreDto.toServiceModel(),
			req.userUUID
		);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

router.get('/stores/:storeUUID', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const { storeUUID } = req.params;

		if (!storeUUID) {
			throw new Error('no storeId params');
		}

		const storeData = await storeService.getStore(storeUUID, req.userUUID);

		const store = new GetStoreDto(storeData);

		res.json({ data: store });
	} catch (error) {
		next(error);
	}
});

router.patch('/stores/:storeUUID', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const { storeUUID } = req.params;

		if (!storeUUID) {
			throw new Error('no storeId params');
		}

		const updateStoreDto = new UpdateStoreDto(req.body);

		await validateOrReject(updateStoreDto);

		await storeService.updateStore(
			updateStoreDto.toServiceModel(),
			storeUUID,
			req.userUUID
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
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new Error('no storeId params');
			}

			await storeService.removeStore(storeUUID, req.userUUID);

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
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new Error('no storeId params');
			}

			await storeService.likeStore(storeUUID, req.userUUID);

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
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new Error('no storeId params');
			}

			await storeService.unlikeStore(storeUUID, req.userUUID);

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
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeUUID } = req.params;

			if (!storeUUID) {
				throw new Error('no storeId params');
			}

			const createStoreReviewDto = new CreateStoreReviewDto(req.body);

			await validateOrReject(createStoreReviewDto);

			await storeService.createStoreReview(
				createStoreReviewDto.toServiceModel(),
				storeUUID,
				req.userUUID
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
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeUUID, storeReviewUUID } = req.params;

			if (!storeUUID) {
				throw new Error('no storeId params');
			}

			if (!storeReviewUUID) {
				throw new Error('no storeReviewId params');
			}

			const updateStoreReviewDto = new UpdateStoreReviewDto(req.body);

			await validateOrReject(updateStoreReviewDto);

			await storeService.updateStoreReview(
				updateStoreReviewDto.toServiceModel(),
				storeUUID,
				storeReviewUUID,
				req.userUUID
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
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeUUID, storeReviewUUID } = req.params;

			if (!storeUUID) {
				throw new Error('no storeId params');
			}

			if (!storeReviewUUID) {
				throw new Error('no storeId params');
			}

			await storeService.removeStoreReview(
				storeUUID,
				storeReviewUUID,
				req.userUUID
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
