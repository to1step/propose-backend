import { Model, model, Schema } from 'mongoose';

interface StoreReviewDAO {
	uuid: string;
	user: string;
	store: string;
	review: string;
	deletedAt: Date | null;
}

type StoreReviewDAOModel = Model<StoreReviewDAO>;

const storeReviewSchema = new Schema<StoreReviewDAO, StoreReviewDAOModel>(
	{
		uuid: { type: String, required: true }, // 가게 리뷰 식별 uuid
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
		review: { type: String, required: true }, // 리뷰 내용
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

const StoreReviewModel = model<StoreReviewDAO, StoreReviewDAOModel>(
	'StoreReview',
	storeReviewSchema
);

export { StoreReviewModel };
