import { Model, model, Schema } from 'mongoose';

interface StoreDAO {
	uuid: string;
	user: string;
	name: string;
	description: string;
	coordinates: number[];
	location: string;
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
	allowed: boolean;
	deletedAt: Date | null;
}

interface StoreDAOModel extends Model<StoreDAO> {
	findStoreByUUID(storeUUID: string): Promise<StoreDAO | null>;
}

const storeSchema = new Schema<StoreDAO, StoreDAOModel>(
	{
		uuid: { type: String, required: true }, // 가게 식별 uuid
		user: { type: String, required: true }, // 생성한 유저 uuid
		description: { type: String, required: true }, // 가게 설명
		name: { type: String, required: true }, // 가게 이름
		coordinates: { type: [Number], required: true }, // 가게 좌표
		location: { type: String, required: true }, // 가게 주소
		representImage: { type: String }, // 가게 대표 사진 src
		tags: { type: [String] }, // 가게 태그 배열
		startTime: { type: String }, // 가게 오픈 시간
		endTime: { type: String }, // 가게 종료 시간
		allowed: { type: Boolean, required: true }, // 인증 받은 가게 인지 확인
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
