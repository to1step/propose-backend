import { Model, model, Schema } from 'mongoose';

interface IStoreImage {
	user: string;
	store: string;
	image: string;
}

interface IStore {
	uuid: string;
	name: string;
	coordinates: number[];
	representImage?: string;
	images?: IStoreImage[];
	tags?: string[];
	startTime?: string;
	endTime?: string;
}

type IStoreImageModel = Model<IStoreImage>;
type IStoreModel = Model<IStore>;

const storeImageSchema = new Schema<IStoreImage, IStoreImageModel>({
	user: { type: String, required: true }, // 사진 업로드한 유저 식별 uuid
	store: { type: String, required: true },
	image: { type: String, required: true }, // 이미지 src
});

const StoreImage = model<IStoreImage, IStoreImageModel>(
	'Store',
	storeImageSchema
);

const storeSchema = new Schema<IStore, IStoreModel>(
	{
		uuid: { type: String, required: true }, // 가게 식별 uuid
		name: { type: String, required: true }, // 가게 이름
		coordinates: { type: [Number], requred: true }, // 가게좌표
		representImage: { type: String }, // 가게 대표 사진 src
		images: { type: [StoreImage] }, // 가게 리뷰 사진들
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
