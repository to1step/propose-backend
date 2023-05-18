import { v4 } from 'uuid';
import { StoreModel } from '../../database/models/store';
import {
	CreateStoreForm,
	CreateStoreReviewForm,
	LikeStoreForm,
	UnlikeStoreForm,
	UpdateStoreForm,
	UpdateStoreReviewForm,
} from '../types/type';
import { StoreLikeModel } from '../../database/models/storeLike';
import { StoreReviewModel } from '../../database/models/storeReview';

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

	/**
	 * 가게 좋아요
	 * @param likeStoreForm
	 * @param userUUID
	 */
	async likeStore(
		likeStoreForm: LikeStoreForm,
		userUUID: string
	): Promise<void> {
		const { storeUUID } = likeStoreForm;
		const store = await StoreModel.findOne({ uuid: storeUUID });

		if (!store || store.deletedAt) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		await new StoreLikeModel({
			user: userUUID,
			store: storeUUID,
		}).save();
	}

	/**
	 * 가게 좋아요 취소
	 * @param unlikeStoreForm
	 * @param userUUID
	 */
	async unlikeStore(
		unlikeStoreForm: UnlikeStoreForm,
		userUUID: string
	): Promise<void> {
		const { storeUUID } = unlikeStoreForm;
		const store = await StoreModel.findOne({ uuid: storeUUID });

		if (!store || store.deletedAt) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		const likeHistory = await StoreLikeModel.findOne({
			user: userUUID,
			store: storeUUID,
		});

		if (!likeHistory || likeHistory.deletedAt) {
			// 좋아요를 하지 않았거나, 이미 취소하였던 좋아요를 좋아요를 취소하는 경우
			throw new Error('invalid access');
		}

		likeHistory.deletedAt = new Date();
		await likeHistory.save();
	}

	/**
	 * 가게 리뷰 생성
	 * @param createStoreReviewForm
	 * @param userUUID
	 */
	async createStoreReview(
		createStoreReviewForm: CreateStoreReviewForm,
		userUUID: string
	): Promise<void> {
		const { storeUUID, review } = createStoreReviewForm;

		const store = await StoreModel.findOne({ uuid: storeUUID });

		if (!store || store.deletedAt) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		const newUUID = v4();

		await new StoreReviewModel({
			uuid: newUUID,
			user: userUUID,
			store: storeUUID,
			review: review,
		}).save();
	}

	/**
	 * 가게 리뷰 수정
	 * @param updateStoreReviewForm
	 * @param userUUID
	 */
	async updateStoreReview(
		updateStoreReviewForm: UpdateStoreReviewForm,
		userUUID: string
	): Promise<void> {
		const { storeReviewUUID, review } = updateStoreReviewForm;

		const storeReview = await StoreReviewModel.findOne({
			uuid: storeReviewUUID,
		});

		if (!storeReview || storeReview.deletedAt) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new Error('review not found');
		}

		if (storeReview.user !== userUUID) {
			// 작성자가 아닌 사람이 수정하려 하는 경우
			throw new Error('only creator can update');
		}

		storeReview.review = review;
		await storeReview.save();
	}

	/**
	 * 가게 리뷰 삭제
	 * @param storeReviewUUID
	 * @param userUUID
	 */
	async removeStoreReview(
		storeReviewUUID: string,
		userUUID: string
	): Promise<void> {
		const storeReview = await StoreReviewModel.findOne({
			uuid: storeReviewUUID,
		});

		if (!storeReview || storeReview.deletedAt) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new Error('review not found');
		}

		if (storeReview.user !== userUUID) {
			// 작성자가 아닌 사람이 삭제하려 하는 경우
			throw new Error('only creator can delete');
		}

		storeReview.deletedAt = new Date();
		await storeReview.save();
	}
}

export default StoreService;
