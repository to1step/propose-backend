import { Model, model, Schema } from 'mongoose';

interface IStoreLike {
	userUUID: string;
	storeUUID: string;
}

type IStoreLikeModel = Model<IStoreLike>;

const storeLikeSchema = new Schema<IStoreLike, IStoreLikeModel>({
	userUUID: { type: String, required: true },
	storeUUID: { type: String, required: true },
});

const StoreLike = model<IStoreLike, IStoreLikeModel>(
	'StoreLike',
	storeLikeSchema
);

export { StoreLike };
