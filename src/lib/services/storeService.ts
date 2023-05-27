import { v4 } from 'uuid';
import {
	CreateStoreForm,
	CreateStoreReviewForm,
	GetStore,
	LikeStoreForm,
	UnlikeStoreForm,
	UpdateStoreForm,
	UpdateStoreReviewForm,
} from '../types/type';
import ModelConverter from '../../utilies/converter/modelConverter';
import { StoreModel } from '../../database/models/store';
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
	 * @param storeUUID
	 * @param userUUID
	 */
	async updateStore(
		updateStoreForm: UpdateStoreForm,
		storeUUID: string,
		userUUID: string
	): Promise<void> {
		const { name, coordinates, representImage, tags, startTime, endTime } =
			updateStoreForm;

		const store = await StoreModel.findOneAndUpdate(
			{
				uuid: storeUUID,
				userUUID: userUUID,
				deletedAt: null,
			},
			{
				name: name,
				coordinates: coordinates,
				representImage: representImage,
				tags: tags,
				startTime: startTime,
				endTime: endTime,
			},
			{ new: true }
		);

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}
	}

	/**
	 * 가게 정보 가져오기
	 * @param storeUUID
	 * @param userUUID
	 */
	async getStore(storeUUID: string, userUUID: string): Promise<GetStore> {
		const store = await StoreModel.findStoreByUUID(storeUUID);

		if (store === null) {
			throw new Error('store not found');
		}

		const storeData = ModelConverter.toStore(store);

		const [storeReviews, storeLikes] = await Promise.all([
			StoreReviewModel.findStoreReviewByStore(storeUUID),
			StoreLikeModel.find({ store: storeUUID, deletedAt: null }),
		]);

		const storeReviewData = ModelConverter.toStoreReview(storeReviews);

		const reviewCount = storeReviews.length;

		const likeCount = storeLikes.length;

		let iLike = false;

		for (let i = 0; i < likeCount; i += 1) {
			if (storeLikes[i].user === userUUID) {
				iLike = true;
				break;
			}
		}

		return {
			...storeData,
			storeReviews: storeReviewData,
			reviewCount,
			likeCount,
			iLike,
		};
	}

	/**
	 * 가게 삭제
	 * @param storeUUID
	 * @param userUUID
	 */
	async removeStore(storeUUID: string, userUUID: string): Promise<void> {
		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
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
	 * @param storeUUID
	 * @param userUUID
	 */
	async likeStore(storeUUID: string, userUUID: string): Promise<void> {
		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		const likeHistory = await StoreLikeModel.findOne({
			user: userUUID,
			store: storeUUID,
			deletedAt: null,
		});

		if (likeHistory) {
			// 좋아요를 이미 했는데 다시 좋아요를 누르는 경우
			throw new Error('invalid access');
		}

		await new StoreLikeModel({
			user: userUUID,
			store: storeUUID,
		}).save();
	}

	/**
	 * 가게 좋아요 취소
	 * @param storeUUID
	 * @param userUUID
	 */
	async unlikeStore(storeUUID: string, userUUID: string): Promise<void> {
		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new Error('store not found');
		}

		const likeHistory = await StoreLikeModel.findOneAndUpdate(
			{
				user: userUUID,
				store: storeUUID,
				deletedAt: null,
			},
			{ deletedAt: new Date() },
			{ new: true }
		);

		if (!likeHistory) {
			// 좋아요를 하지 않았는데 취소하는 경우
			throw new Error('invalid access');
		}
	}

	/**
	 * 가게 리뷰 생성
	 * @param createStoreReviewForm
	 * @param storeUUID
	 * @param userUUID
	 */
	async createStoreReview(
		createStoreReviewForm: CreateStoreReviewForm,
		storeUUID: string,
		userUUID: string
	): Promise<void> {
		const { review } = createStoreReviewForm;

		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
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
	 * @param storeUUID
	 * @param storeReviewUUID
	 * @param userUUID
	 */
	async updateStoreReview(
		updateStoreReviewForm: UpdateStoreReviewForm,
		storeUUID: string,
		storeReviewUUID: string,
		userUUID: string
	): Promise<void> {
		const { review } = updateStoreReviewForm;

		const storeReview = await StoreReviewModel.findOneAndUpdate(
			{
				uuid: storeReviewUUID,
				store: storeUUID,
				user: userUUID,
				deletedAt: null,
			},
			{ review: review },
			{ new: true }
		);

		if (!storeReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new Error('review not found');
		}
	}

	/**
	 * 가게 리뷰 삭제
	 * @param storeUUID
	 * @param storeReviewUUID
	 * @param userUUID
	 */
	async removeStoreReview(
		storeUUID: string,
		storeReviewUUID: string,
		userUUID: string
	): Promise<void> {
		const storeReview = await StoreReviewModel.findOneAndUpdate(
			{
				uuid: storeReviewUUID,
				store: storeUUID,
				user: userUUID,
				deletedAt: null,
			},
			{ deletedAt: new Date() },
			{ new: true }
		);

		if (!storeReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new Error('review not found');
		}
	}
}

export default StoreService;
