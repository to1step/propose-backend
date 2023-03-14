import { Model, model, Schema } from 'mongoose';

interface IStore {
	uuid: string;
	name: string;
	coordinates: number[];
	representImage?: string;
	tags?: string[];
	startTime?: string;
	endTime?: string;
}

type IStoreModel = Model<IStore>;
const storeSchema = new Schema<IStore, IStoreModel>(
	{
		uuid: { type: String, required: true }, // 가게 식별 uuid
		name: { type: String, required: true }, // 가게 이름
		coordinates: { type: [Number], requred: true }, // 가게좌표
		representImage: { type: String }, // 가게 대표 사진 src
		tags: { type: [String] }, // 가게 태그 배열
		startTime: { type: Date }, // 가게 오픈 시간
		endTime: { type: Date }, // 가게 종료 시간
	},
	{
		timestamps: true,
	}
);

const Store = model<IStore, IStoreModel>('Store', storeSchema);

export { Store };