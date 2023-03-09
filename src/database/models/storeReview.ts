import { Model, model, Schema } from 'mongoose';

interface IStoreReview {
	userUUID: string;
	storeUUID: string;
	comment: string;
}

type IStoreReviewModel = Model<IStoreReview>;

const storeReviewSchema = new Schema<IStoreReview, IStoreReviewModel>({
	userUUID: { type: String, required: true }, // 작성한 유저 식별 uuid
	storeUUID: { type: String, required: true }, // 가게 식별 uuid
	comment: { type: String, required: true }, // 리뷰 내용
});

const StoreReview = model<IStoreReview, IStoreReviewModel>(
	'StoreReview',
	storeReviewSchema
);

export { StoreReview };
