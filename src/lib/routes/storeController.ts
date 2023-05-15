import express from 'express';
import { validateOrReject } from 'class-validator';
import StoreService from '../services/storeService';
import checkHeaderToken from '../middlewares/checkHeaderToken';
import CreateStoreDto from '../types/requestTypes/createStore.dto';
import UpdateStoreDto from '../types/requestTypes/updateStore.dto';

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

export default router;
