import { Model, model, Schema } from 'mongoose';

interface IStoreLike {
	userUUID: string;
	storeUUID: string;
}

type IStoreLikeModel = Model<IStoreLike>;

const storeLikeSchema = new Schema<IStoreLike, IStoreLikeModel>({
	userUUID: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
	storeUUID: { type: String, required: true }, // 가게 식별 uuid
});

const StoreLike = model<IStoreLike, IStoreLikeModel>(
	'StoreLike',
	storeLikeSchema
);

export { StoreLike };
