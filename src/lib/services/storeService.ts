import { v4 } from 'uuid';
import { StoreModel } from '../../database/models/store';
import { CreateStoreForm, UpdateStoreForm } from '../types/type';

class StoreService {
	private static instance: StoreService;

	private constructor() {}

	public static getInstance(): StoreService {
		if (!StoreService.instance) {
			StoreService.instance = new StoreService();
		}
		return StoreService.instance;
	}

	/**
	 * 새로운 가게 생성, 관리자 측에서 승낙이 떨어지면 가게로 인정
	 * @param createStoreForm
	 * @param userUUID
	 */
	async createStore(
		createStoreForm: CreateStoreForm,
		userUUID: string
	): Promise<void> {
		const { name, coordinates, representImage, tags, startTime, endTime } =
			createStoreForm;

		const newUUID = v4();

		await new StoreModel({
			userUUID: userUUID,
			uuid: newUUID,
			name: name,
			coordinates: coordinates,
			representImage: representImage,
			tags: tags,
			startTime: startTime,
			endTime: endTime,
			allowed: false,
		}).save();
	}

	/**
	 * 가게 정보 업데이트
	 * @param updateStoreForm
	 * @param userUUID
	 */
	async updateStore(
		updateStoreForm: UpdateStoreForm,
		userUUID: string
	): Promise<void> {
		const {
			storeUUID,
			name,
			coordinates,
			representImage,
			tags,
			startTime,
			endTime,
		} = updateStoreForm;

		const store = await StoreModel.findOne({ uuid: storeUUID });

		if (!store || store.deletedAt) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		if (store.userUUID !== userUUID) {
			// 생성자와 수정자가 다른 경우
			throw new Error('only creator can update');
		}

		store.name = name;
		store.coordinates = coordinates;
		store.representImage = representImage;
		store.tags = tags;
		store.startTime = startTime;
		store.endTime = endTime;

		await store.save();
	}

	/**
	 * 가게 정보 가져오기
	 * @param storeUUID
	 */
	async getStore(storeUUID: string): Promise<void> {
		const store = await StoreModel.findOne({ uuid: storeUUID });

		// TODO: LIKE, REVIEW 개발 후 적용
	}

	/**
	 * 가게 삭제
	 * @param storeUUID
	 * @param userUUID
	 */
	async removeStore(storeUUID: string, userUUID: string): Promise<void> {
		const store = await StoreModel.findOne({ uuid: storeUUID });

		if (!store || store.deletedAt) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		if (store.userUUID !== userUUID) {
			// 생성자와 수정자가 다른 경우
			throw new Error('only creator can delete');
		}

		store.deletedAt = new Date();
		await store.save();
	}
}

export default StoreService;
