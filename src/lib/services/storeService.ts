import { v4 } from 'uuid';
import {
	CreateStoreForm,
	CreateStoreReviewForm,
	Store,
	StoreEntireInfo,
	UpdateStoreForm,
	UpdateStoreReviewForm,
} from '../types/type';
import ModelConverter from '../../utilies/converter/modelConverter';
import Redis from '../../utilies/redis';
import GetTimeKr from '../../utilies/dayjsKR';
import { StoreModel } from '../../database/models/store';
import { StoreLikeModel } from '../../database/models/storeLike';
import { StoreReviewModel } from '../../database/models/storeReview';
import { StoreScoreModel } from '../../database/models/storeScore';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import { StoreTagModel } from '../../database/models/storeTag';

const redis = Redis.getInstance().getClient();

const dayjsKR = GetTimeKr.getInstance();

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
		userUUID: string,
		createStoreForm: CreateStoreForm
	): Promise<void> {
		const {
			name,
			category,
			description,
			location,
			coordinates,
			representImage,
			tags,
			startTime,
			endTime,
		} = createStoreForm;

		const newUUID = v4();

		const locationSplit = location.split(' ');
		let shortLocation;
		if (locationSplit.length < 2) {
			// 주소가 한단어 이하인 경우 그냥 주소룰 할당
			shortLocation = location;
		} else {
			// 두 글자 이상인 경우 앞 문자 두개 저장
			shortLocation = `${locationSplit[0]} ${locationSplit[1]}`;
		}

		const promises = tags.map(async (tag) => {
			const tagData = await StoreTagModel.findOne({ tag: tag });

			if (!tagData) {
				await new StoreTagModel({
					tag: tag,
					stores: [newUUID],
				}).save();
			} else {
				tagData.stores.push(newUUID);

				await tagData.save();
			}
		});

		await Promise.all(promises);

		await new StoreModel({
			user: userUUID,
			uuid: newUUID,
			name: name,
			category: category,
			description: description,
			shortLocation: shortLocation,
			location: location,
			coordinates: coordinates,
			representImage: representImage,
			tags: tags,
			startTime: startTime,
			endTime: endTime,
			allowed: false,
		}).save();
	}

	/**
	 * 가게 정보 가져오기
	 * @param userUUID
	 * @param storeUUID
	 */
	async getStore(
		userUUID: string,
		storeUUID: string
	): Promise<StoreEntireInfo> {
		const store = await StoreModel.findStoreByUUID(storeUUID);

		if (store === null) {
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const storeData = ModelConverter.toStore(store);

		const [storeReviews, storeLikes] = await Promise.all([
			StoreReviewModel.findStoreReviewByStore(storeUUID),
			StoreLikeModel.find({ store: storeUUID, deletedAt: null }),
		]);

		const storeReviewData = storeReviews.map((storeReview) =>
			ModelConverter.toStoreReview(storeReview)
		);

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
	 * 지역 기반 가게들 가져오기
	 * @param region
	 */
	async getStoresByLocation(region: string): Promise<Store[]> {
		const stores = await StoreModel.find({
			shortLocation: region,
			deletedAt: null,
			allowed: true,
		});

		if (stores.length === 0) {
			return [];
		}

		return stores.map((store) => {
			return ModelConverter.toStore(store);
		});
	}

	/**
	 * 태그를 통한 가게 검색
	 * @param tag
	 */
	async getStoresByTag(tag: string): Promise<Store[]> {
		const stores = await StoreModel.find({ tags: tag }, null, {
			limit: 8,
			skip: 0,
		});

		return stores.map((store) => ModelConverter.toStore(store));

		// const tagData = await StoreTagModel.findOne({ tag: tag });
		//
		// if (!tagData) {
		// 	throw new InternalServerError(ErrorCode.TAG_NOT_FOUND, [
		// 		{ data: 'Tag not found' },
		// 	]);
		// }
		//
		// const storeUUIDs = tagData.stores;
		//
		// const stores = await StoreModel.find({ name: { $in: storeUUIDs } });
		//
		// return stores.map((store) => ModelConverter.toStore(store));
	}

	/**
	 * 내가 등록한 가게들 가져오기
	 * @param userUUID
	 */
	async getMyStores(userUUID: string): Promise<Store[]> {
		const stores = await StoreModel.find({ user: userUUID, deletedAt: null });

		if (stores.length === 0) {
			return [];
		}

		return stores.map((store) => {
			return ModelConverter.toStore(store);
		});
	}

	/**
	 * 가게 정보 업데이트
	 * @param userUUID
	 * @param storeUUID
	 * @param updateStoreForm
	 */
	async updateStore(
		userUUID: string,
		storeUUID: string,
		updateStoreForm: UpdateStoreForm
	): Promise<void> {
		const {
			name,
			category,
			description,
			location,
			coordinates,
			representImage,
			tags,
			startTime,
			endTime,
		} = updateStoreForm;

		const store = await StoreModel.findOne({
			uuid: storeUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const locationSplit = location.split(' ');
		let shortLocation;
		if (locationSplit.length < 2) {
			// 주소가 한단어 이하인 경우 그냥 주소룰 할당
			shortLocation = location;
		} else {
			// 두 글자 이상인 경우 앞 문자 두개 저장
			shortLocation = `${locationSplit[0]} ${locationSplit[1]}`;
		}

		// 새롭게 생성된 태그들과 삭제된 태그들 분류
		const newTags = tags.filter((tag: string) => !store.tags.includes(tag));
		const deletedTags = store.tags.filter((tag: string) => !tags.includes(tag));

		// 새로운 태그 추가
		const newPromises = newTags.map(async (tag) => {
			const tagData = await StoreTagModel.findOne({ tag: tag });

			if (!tagData) {
				await new StoreTagModel({
					tag: tag,
					stores: [storeUUID],
				}).save();
			} else {
				tagData.stores.push(storeUUID);

				await tagData.save();
			}
		});

		// 해당 태그 배열에서 storeUUID 삭제
		const deletePromises = deletedTags.map(async (tag) => {
			const tagData = await StoreTagModel.findOne({ tag: tag });

			if (!tagData) {
				throw new InternalServerError(ErrorCode.TAG_NOT_FOUND, [
					{ data: 'Tag not found' },
				]);
			} else {
				tagData.stores = tagData.stores.filter(
					(storeId) => storeId !== storeUUID
				);

				await tagData.save();
			}
		});

		await Promise.all([newPromises, deletePromises]);

		store.name = name;
		store.category = category;
		store.description = description;
		store.location = location;
		store.shortLocation = shortLocation;
		store.coordinates = coordinates;
		store.representImage = representImage;
		store.tags = tags;
		store.startTime = startTime;
		store.endTime = endTime;

		await store.save();
	}

	/**
	 * 가게 삭제
	 * @param userUUID
	 * @param storeUUID
	 */
	async removeStore(userUUID: string, storeUUID: string): Promise<void> {
		const store = await StoreModel.findOne({
			uuid: storeUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		// 각 태그들에서 가게 삭제
		store.tags.map(async (tag) => {
			const tagData = await StoreTagModel.findOne({ tag: tag });

			if (!tagData) {
				throw new InternalServerError(ErrorCode.TAG_NOT_FOUND, [
					{ data: 'Tag not found' },
				]);
			} else {
				tagData.stores = tagData.stores.filter(
					(storeId) => storeId !== storeUUID
				);

				await tagData.save();
			}
		});

		store.deletedAt = new Date();
		await store.save();
	}

	/**
	 * 가게 좋아요
	 * @param userUUID
	 * @param storeUUID
	 */
	async likeStore(userUUID: string, storeUUID: string): Promise<void> {
		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const likeHistory = await StoreLikeModel.findOne({
			user: userUUID,
			store: storeUUID,
			deletedAt: null,
		});

		if (likeHistory) {
			// 좋아요를 이미 했는데 다시 좋아요를 누르는 경우
			throw new BadRequestError(ErrorCode.DUPLICATE_STORE_LIKE_ERROR, [
				{ data: 'Duplicate store like' },
			]);
		}

		await Promise.all([
			new StoreLikeModel({
				user: userUUID,
				store: storeUUID,
			}).save(),
			this.scoreToStore(userUUID, storeUUID, store.shortLocation, 'add'),
		]);
	}

	/**
	 * 가게 좋아요 취소
	 * @param userUUID
	 * @param storeUUID
	 */
	async unlikeStore(userUUID: string, storeUUID: string): Promise<void> {
		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const likeHistory = await StoreLikeModel.findOne({
			user: userUUID,
			store: storeUUID,
			deletedAt: null,
		});

		if (!likeHistory) {
			// 좋아요를 하지 않았는데 취소하는 경우
			throw new BadRequestError(ErrorCode.STORE_LIKE_NOT_FOUND, [
				{ data: 'Like not found' },
			]);
		}

		likeHistory.deletedAt = new Date();
		await Promise.all([
			likeHistory.save(),
			this.scoreToStore(userUUID, storeUUID, store.location, 'sub'),
		]);
	}

	/**
	 * 가게 리뷰 생성
	 * @param userUUID
	 * @param storeUUID
	 * @param createStoreReviewForm
	 */
	async createStoreReview(
		userUUID: string,
		storeUUID: string,
		createStoreReviewForm: CreateStoreReviewForm
	): Promise<void> {
		const { review } = createStoreReviewForm;

		const store = await StoreModel.findOne({
			uuid: storeUUID,
			deletedAt: null,
		});

		if (!store) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const newUUID = v4();

		await Promise.all([
			new StoreReviewModel({
				uuid: newUUID,
				user: userUUID,
				store: storeUUID,
				review: review,
			}).save(),
			this.scoreToStore(userUUID, storeUUID, store.location, 'sub'),
		]);
	}

	/**
	 * 가게 리뷰 수정
	 * @param userUUID
	 * @param storeUUID
	 * @param storeReviewUUID
	 * @param updateStoreReviewForm
	 */
	async updateStoreReview(
		userUUID: string,
		storeUUID: string,
		storeReviewUUID: string,
		updateStoreReviewForm: UpdateStoreReviewForm
	): Promise<void> {
		const { review } = updateStoreReviewForm;

		const storeReview = await StoreReviewModel.findOne({
			uuid: storeReviewUUID,
			store: storeUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!storeReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new InternalServerError(ErrorCode.STORE_REVIEW_NOT_FOUND, [
				{ data: { data: 'Store review not found' } },
			]);
		}

		storeReview.review = review;
		await storeReview.save();
	}

	/**
	 * 가게 리뷰 삭제
	 * @param userUUID
	 * @param storeUUID
	 * @param storeReviewUUID
	 */
	async removeStoreReview(
		userUUID: string,
		storeUUID: string,
		storeReviewUUID: string
	): Promise<void> {
		const storeReview = await StoreReviewModel.findOne({
			uuid: storeReviewUUID,
			store: storeUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!storeReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new InternalServerError(ErrorCode.STORE_REVIEW_NOT_FOUND, [
				{ data: 'Store review not found' },
			]);
		}

		storeReview.deletedAt = new Date();
		await storeReview.save();
	}

	/**
	 * 가게에 점수 부여하기
	 * @param userUUID
	 * @param storeUUID
	 * @param shortLocation
	 * @param type
	 */
	async scoreToStore(
		userUUID: string,
		storeUUID: string,
		shortLocation: string,
		type: 'add' | 'sub'
	): Promise<void> {
		const [sunStart, satEnd] = dayjsKR.getWeek();

		// 이번주(일~토)안에 등록되었는지 확인
		const storeScore = await StoreScoreModel.findOne({
			store: storeUUID,
			date: { $gt: sunStart, $lt: satEnd },
		});

		if (storeScore) {
			if (type === 'add') {
				storeScore.score += 1;
			} else {
				storeScore.score -= 1;
			}
			await storeScore.save();
		} else {
			await new StoreScoreModel({
				store: storeUUID,
				shortLocation: shortLocation,
				date: Date.now().toString(),
				score: type === 'add' ? 1 : 0,
			}).save();
		}
	}
}

export default StoreService;
