import { Model, model, Schema } from 'mongoose';

interface StoreImageDAO {
	uuid: string;
	user: string;
	store: string;
	imageSrc: string;
	deletedAt: Date | null;
}

type StoreImageDAOModel = Model<StoreImageDAO>;

const storeImageSchema = new Schema<StoreImageDAO, StoreImageDAOModel>(
	{
		uuid: { type: String, required: true },
		user: { type: String, required: true },
		store: { type: String, required: true },
		imageSrc: { type: String, required: true },
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

const StoreImageModel = model<StoreImageDAO, StoreImageDAOModel>(
	'StoreImage',
	storeImageSchema
);

export { StoreImageDAO, StoreImageModel };
