import { Model, model, Schema } from 'mongoose';

interface StoreScoreDAO {
	store: string;
	shortLocation: string;
	date: string;
	score: number;
}

type StoreScoreDAOModel = Model<StoreScoreDAO>;

const storeScoreSchema = new Schema<StoreScoreDAO, StoreScoreDAOModel>(
	{
		store: { type: String, required: true }, // 가게 식별 uuid
		shortLocation: { type: String, required: true }, // 해당 지역 string 두 글자
		date: { type: String, required: true }, // 저장된 시각 millisecond
		score: { type: Number, required: true, default: 0 }, // 가게 점수
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
