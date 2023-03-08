import { Model, model, Schema } from 'mongoose';

interface IStore {
	uuid: string;
	name: string;
	coordinates: [number, number][];
	representImage?: string;
	images?: { userUUID: string; image: string }[];
	tags?: string[];
	startTime?: string;
	endTime?: string;
}

type IStoreModel = Model<IStore>;

const storeSchema = new Schema<IStore, IStoreModel>({
	uuid: { type: String, required: true },
	name: { type: String, required: true },
	coordinates: { type: [[Number, Number]], requred: true },
	representImage: { type: String },
	images: {
		type: [
			{
				userUUID: { type: String, required: true },
				image: { type: String, required: true },
			},
		],
	},
	tags: { type: [String] },
	startTime: { type: Date },
	endTime: { type: Date, required: true },
});

const Store = model<IStore, IStoreModel>('Store', storeSchema);

export { Store };
