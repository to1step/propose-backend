import { Model, model, Schema } from 'mongoose';

interface IStoreReview {
	user: string;
	store: string;
	comment: string;
}

type IStoreReviewModel = Model<IStoreReview>;

const storeReviewSchema = new Schema<IStoreReview, IStoreReviewModel>(
	{
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
		comment: { type: String, required: true }, // 리뷰 내용
	},
	{
		timestamps: true,
	}
);

const StoreReview = model<IStoreReview, IStoreReviewModel>(
	'StoreReview',
	storeReviewSchema
);

export { StoreReview };
