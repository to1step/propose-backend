import { Model, model, Schema } from 'mongoose';

interface StoreDAO {
	uuid: string;
	name: string;
	coordinates: number[];
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
	userUUID: string;
	allowed: boolean;
	deletedAt: Date | null;
}

interface StoreDAOModel extends Model<StoreDAO> {
	findStoreByUUID(storeUUID: string): Promise<StoreDAO | null>;
}

const storeSchema = new Schema<StoreDAO, StoreDAOModel>(
	{
		uuid: { type: String, required: true }, // 가게 식별 uuid
		name: { type: String, required: true }, // 가게 이름
		coordinates: { type: [Number], required: true }, // 가게좌표
		representImage: { type: String }, // 가게 대표 사진 src
		tags: { type: [String] }, // 가게 태그 배열
		startTime: { type: String }, // 가게 오픈 시간
		endTime: { type: String }, // 가게 종료 시간
		userUUID: { type: String, required: true },
		allowed: { type: Boolean, required: true },
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: {
			createdAt: true,
			updatedAt: true,
		},
	}
);

storeSchema.static(
	'findStoreByUUID',
	async function findStoreByUUID(storeUUID: string) {
		return this.findOne({ uuid: storeUUID, deletedAt: null });
	}
);

const StoreModel = model<StoreDAO, StoreDAOModel>('Store', storeSchema);

export { StoreModel, StoreDAO };
