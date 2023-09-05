import { Model, model, Schema } from 'mongoose';

interface StoreTagDAO {
	tag: string;
	stores: string[];
}

type StoreTagDAOModel = Model<StoreTagDAO>;

const storeTagSchema = new Schema<StoreTagDAO, StoreTagDAOModel>(
	{
		tag: { type: String, required: true }, // 태그
		stores: { type: [String], required: true }, // 태그를 가지는 가게들
	},
	{
		timestamps: true,
	}
);

const StoreTagModel = model<StoreTagDAO, StoreTagDAOModel>(
	'StoreTag',
	storeTagSchema
);

export { StoreTagModel, StoreTagDAO };
