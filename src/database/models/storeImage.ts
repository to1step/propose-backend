import { Model, model, Schema } from 'mongoose';

interface IStoreImage {
	user: string;
	store: string;
	imageSrc: string;
}

type IStoreImageModel = Model<IStoreImage>;
const storeImageSchema = new Schema<IStoreImage, IStoreImageModel>(
	{
		user: { type: String, required: true },
		store: { type: String, required: true },
		imageSrc: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const StoreImage = model<IStoreImage, IStoreImageModel>(
	'StoreImage',
	storeImageSchema
);

export { StoreImage };
