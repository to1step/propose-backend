import { Model, model, Schema } from 'mongoose';

interface StoreImageDAO {
	user: string;
	store: string;
	imageSrc: string;
}

type StoreImageDAOModel = Model<StoreImageDAO>;

const storeImageSchema = new Schema<StoreImageDAO, StoreImageDAOModel>(
	{
		user: { type: String, required: true },
		store: { type: String, required: true },
		imageSrc: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const StoreImage = model<StoreImageDAO, StoreImageDAOModel>(
	'StoreImage',
	storeImageSchema
);

export { StoreImage };
