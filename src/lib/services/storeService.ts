import { v4 } from 'uuid';
import { Client } from '@elastic/elasticsearch';
import {
	CreateStoreForm,
	CreateStoreReviewForm,
	ElasticSearchResponse,
	Store,
	StoreEntireInfo,
	UpdateStoreForm,
	UpdateStoreReviewForm,
} from '../types/type';
import ModelConverter from '../../utilies/converter/modelConverter';
import { StoreModel } from '../../database/models/store';
import { StoreLikeModel } from '../../database/models/storeLike';
import { StoreReviewModel } from '../../database/models/storeReview';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import Elastic from '../../utilies/elastic';

const elastic = Elastic.getInstance();

class StoreService {
	private static instance: StoreService;

	private elasticClient: Client;

	private constructor() {
		this.elasticClient = elastic.getClient();
	}

	public static getInstance(): StoreService {
		if (!StoreService.instance) {
			StoreService.instance = new StoreService();
		}
		return StoreService.instance;
	}

	/**
	 * 태그로 가게 검색 (elasticsearch)
	 * @param tag
	 */
	async findStoreByTag(tag: string): Promise<Store[]> {
		try {
			const searchResults: ElasticSearchResponse =
				await this.elasticClient.search({
					index: tag,
				});

			if (
				typeof searchResults.body === 'boolean' ||
				!searchResults.statusCode ||
				!searchResults.headers
			) {
				throw new InternalServerError(ErrorCode.UNCATCHED_ERROR, [
					{ data: 'Elastic search error' },
				]);
			}

			const storeUUIDs = searchResults.body.hits.hits.map((searchResult) => {
				return searchResult._source.storeUUID;
			});

			const stores = await StoreModel.find({
				uuid: { $in: storeUUIDs },
				deletedAt: null,
			});

			return stores.map((store) => ModelConverter.toStore(store));
		} catch (error: any) {
			// elastic search는 해당 index가 존재하지 않다면 에러가 발생하기 때문에 따로 try-catch로 처리
			if (error.meta?.body?.status === 404) {
				return [];
			}

			throw new InternalServerError(ErrorCode.UNCATCHED_ERROR, [
				{ data: 'Elastic search error' },
			]);
		}
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

		const promises = tags.map((tag) => {
			return this.elasticClient.index({
				index: tag,
				body: {
					storeUUID: newUUID,
				},
			});
		});

		await Promise.all(promises);

		await new StoreModel({
			user: userUUID,
			uuid: newUUID,
			name: name,
			category: category,
			description: description,
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

		store.name = name;
		store.category = category;
		store.description = description;
		store.location = location;
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

		await new StoreLikeModel({
			user: userUUID,
			store: storeUUID,
		}).save();
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
		await likeHistory.save();
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

		await new StoreReviewModel({
			uuid: newUUID,
			user: userUUID,
			store: storeUUID,
			review: review,
		}).save();
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
}

export default StoreService;
