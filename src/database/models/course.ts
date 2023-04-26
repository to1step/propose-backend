import { Model, model, Schema } from 'mongoose';
import { Transportation } from '../types/enums';

interface TransportDAO {
	startStore: string;
	endStore: string;
	comment: string;
	transportation: Transportation;
}

interface CourseDAO {
	uuid: string;
	name: string;
	shortComment: string;
	longComment?: string;
	private: boolean;
	storesUUID: string[];
	transport: TransportDAO[];
	tags: string[];
	user: string;
}

type TransportDAOModel = Model<TransportDAO>;
type CourseDAOModel = Model<CourseDAO>;

const transportSchema = new Schema<TransportDAO, TransportDAOModel>(
	{
		startStore: { type: String, required: true }, // 출발 가게 uuid
		endStore: { type: String, required: true }, // 도착 가게 uuid
		comment: { type: String }, // 이동 방법에 대한 코멘트
		transportation: { type: Number }, // 이동할 수단 버스/지하철/도보 중 택 1
	},
	{ _id: false }
);

const courseSchema = new Schema<CourseDAO, CourseDAOModel>(
	{
		uuid: { type: String, required: true }, // 코스 식별 uuid
		name: { type: String, required: true }, // 코스 이름
		shortComment: { type: String, required: true }, // 코스에 대한 짧은 소개
		longComment: { type: String }, // 코스에 대한 긴 설명
		private: { type: Boolean, required: true }, // 공개 여부
		transport: { type: [transportSchema], required: true }, // 이동 수단
		storesUUID: { type: [String], required: true }, // 코스에 들어가는 가게들
		tags: { type: [String], required: true }, // 태그
		user: { type: String, required: true }, // 코스를 만든 유저 식별 uuid
	},
	{
		timestamps: true,
	}
);

const Course = model<CourseDAO, CourseDAOModel>('Course', courseSchema);

export { Course };
