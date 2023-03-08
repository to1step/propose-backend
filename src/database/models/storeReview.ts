import { Model, model, Schema } from 'mongoose';

interface IStoreReview {
	userUUID: string;
	storeUUID: string;
	comment: string;
}

type IStoreReviewModel = Model<IStoreReview>;

const storeReviewSchema = new Schema<IStoreReview, IStoreReviewModel>({
	userUUID: { type: String, required: true },
	storeUUID: { type: String, required: true },
	comment: { type: String, required: true },
});

const StoreReview = model<IStoreReview, IStoreReviewModel>(
	'StoreReview',
	storeReviewSchema
);

export { StoreReview };
