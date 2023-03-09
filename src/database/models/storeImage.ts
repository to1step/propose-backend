import { Model, model, Schema } from 'mongoose';

interface IStoreImage {
	userUUID: string;
	image: string;
}

type IStoreImageModel = Model<IStoreImage>;

const storeImageSchema = new Schema<IStoreImage, IStoreImageModel>({
	userUUID: { type: String, required: true }, // 사진 업로드한 유저 식별 uuid
	image: { type: String, required: true }, // 이미지 src
});

const StoreImage = model<IStoreImage, IStoreImageModel>(
	'Store',
	storeImageSchema
);

export { StoreImage, IStoreImage };
