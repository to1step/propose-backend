import { Model, model, Schema } from 'mongoose';

interface StoreScoreDAO {
	user: string;
	store: string;
	shortLocation: string;
	date: Date;
	score: number;
}

interface StoreScoreDAOModel extends Model<StoreScoreDAO> {
	findStoreScoreByStore(storeUUID: string): Promise<StoreScoreDAO[]>;
}

const storeScoreSchema = new Schema<StoreScoreDAO, StoreScoreDAOModel>(
	{
		store: { type: String, required: true }, // 가게 식별 uuid
		shortLocation: { type: String, required: true }, // 해당 주의 월요일 00시 00분
		date: { type: Date, required: true }, // 해당 주의 월요일 00시 00분
		score: { type: Number, required: true, default: 0 }, // 해당 주의 월요일 00시 00분
	},
	{
		timestamps: true,
	}
);
const StoreScoreModel = model<StoreScoreDAO, StoreScoreDAOModel>(
	'StoreScore',
	storeScoreSchema
);

export { StoreScoreModel, StoreScoreDAO };
