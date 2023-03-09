import { Model, model, Schema } from 'mongoose';
import { ITransport, Transport } from './transport';

interface ICourse {
	uuid: string;
	name: string;
	shortComment: string;
	longComment?: string;
	private: boolean;
	storesUUID: string[];
	transport: ITransport[];
	tags: string[];
	userUUID: string;
}

type ICourseModel = Model<ICourse>;

const courseSchema = new Schema<ICourse, ICourseModel>({
	uuid: { type: String, required: true }, // 코스 식별 uuid
	name: { type: String, required: true }, // 코스 이름
	shortComment: { type: String, required: true }, // 코스에 대한 짧은 소개
	longComment: { type: String }, // 코스에 대한 긴 설명
	private: { type: Boolean, required: true }, // 공개 여부
	transport: { type: [Transport], required: true }, // 이동 수단
	storesUUID: { type: [String], required: true }, // 코스에 들어가는 가게들
	tags: { type: [String], required: true }, // 태그
	userUUID: { type: String, required: true }, // 코스를 만들 유저 식별 uuid
});

const Course = model<ICourse, ICourseModel>('Course', courseSchema);

export { Course };
