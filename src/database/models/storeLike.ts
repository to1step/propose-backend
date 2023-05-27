import { Model, model, Schema } from 'mongoose';

interface StoreLikeDAO {
	user: string;
	store: string;
	deletedAt: Date | null;
}

type StoreLikeDAOModel = Model<StoreLikeDAO>;

const storeLikeSchema = new Schema<StoreLikeDAO, StoreLikeDAOModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

const StoreLikeModel = model<StoreLikeDAO, StoreLikeDAOModel>(
	'StoreLike',
	storeLikeSchema
);

export { StoreLikeModel };
