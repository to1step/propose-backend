import { Model, model, Schema } from 'mongoose';

interface IStoreLike {
	user: string;
	store: string;
}

type IStoreLikeModel = Model<IStoreLike>;

const storeLikeSchema = new Schema<IStoreLike, IStoreLikeModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
	},
	{
		timestamps: true,
	}
);

const StoreLike = model<IStoreLike, IStoreLikeModel>(
	'StoreLike',
	storeLikeSchema
);

export { StoreLike };
