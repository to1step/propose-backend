import { Model, model, Schema } from 'mongoose';

interface StoreLikeDAO {
	user: string;
	store: string;
}

type StoreLikeDAOModel = Model<StoreLikeDAO>;

const storeLikeSchema = new Schema<StoreLikeDAO, StoreLikeDAOModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
	},
	{
		timestamps: true,
	}
);

const StoreLike = model<StoreLikeDAO, StoreLikeDAOModel>(
	'StoreLike',
	storeLikeSchema
);

export { StoreLike };
