import express from 'express';
import { validateOrReject } from 'class-validator';
import StoreService from '../services/storeService';
import checkHeaderToken from '../middlewares/checkHeaderToken';
import CreateStoreDto from '../types/requestTypes/createStore.dto';
import UpdateStoreDto from '../types/requestTypes/updateStore.dto';
import LikeStoreDto from '../types/requestTypes/likeStore.dto';
import UnlikeStoreDto from '../types/requestTypes/unlikeStore.dto';
import CreateStoreReviewDto from '../types/requestTypes/createStoreReview.dto';
import UpdateStoreReviewDto from '../types/requestTypes/updateStoreReview.dto';

const router = express.Router();
const storeService = StoreService.getInstance();

router.get('/store/:storeUUID', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const { storeUUID } = req.params;

		if (!storeUUID) {
			throw new Error('no storeId params');
		}

		await storeService.getStore(storeUUID);

		// TODO: LIKE, REVIEW 개발 후 적용
	} catch (error) {
		next(error);
	}
});

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

router.delete('/store/:storeUUID', checkHeaderToken, async (req, res, next) => {
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
});

router.patch('/store', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const updateStoreDto = new UpdateStoreDto(req.body);

		await validateOrReject(updateStoreDto);

		await storeService.updateStore(
			updateStoreDto.toServiceModel(),
			req.userUUID
		);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

router.post('/store/like', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const likeStoreDto = new LikeStoreDto(req.body);

		await validateOrReject(likeStoreDto);

		await storeService.likeStore(likeStoreDto.toServiceModel(), req.userUUID);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

router.post('/store/unlike', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const unlikeStoreDto = new UnlikeStoreDto(req.body);

		await validateOrReject(unlikeStoreDto);

		await storeService.unlikeStore(
			unlikeStoreDto.toServiceModel(),
			req.userUUID
		);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

router.post('/store/review', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const createStoreReviewDto = new CreateStoreReviewDto(req.body);

		await validateOrReject(createStoreReviewDto);

		await storeService.createStoreReview(
			createStoreReviewDto.toServiceModel(),
			req.userUUID
		);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

router.patch('/store/review', checkHeaderToken, async (req, res, next) => {
	try {
		if (!req.userUUID) {
			throw new Error('invalid user');
		}

		const updateStoreReviewDto = new UpdateStoreReviewDto(req.body);

		await validateOrReject(updateStoreReviewDto);

		await storeService.updateStoreReview(
			updateStoreReviewDto.toServiceModel(),
			req.userUUID
		);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

router.delete(
	'/store/review/:storeReviewUUID',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			if (!req.userUUID) {
				throw new Error('invalid user');
			}

			const { storeReviewUUID } = req.params;

			if (!storeReviewUUID) {
				throw new Error('no storeId params');
			}

			await storeService.removeStoreReview(storeReviewUUID, req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
