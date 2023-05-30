import { Model, model, Schema } from 'mongoose';
import { Transportation } from '../types/enums';

interface TransportDAO {
	startStore: string;
	endStore: string;
	comment: string | null;
	transportation: Transportation | null;
}

interface CourseDAO {
	uuid: string;
	user: string;
	name: string;
	stores: string[];
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transport: TransportDAO[];
	tags: string[];
	deletedAt: Date | null;
}

type TransportDAOModel = Model<TransportDAO>;
interface CourseDAOModel extends Model<CourseDAO> {
	findCourseByUUID(courseUUID: string): Promise<CourseDAO | null>;
}

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
		user: { type: String, required: true }, // 코스를 만든 유저 식별 uuid
		stores: { type: [String], required: true }, // 코스에 들어가는 가게들
		name: { type: String, required: true }, // 코스 이름
		shortComment: { type: String, required: true }, // 코스에 대한 짧은 소개
		longComment: { type: String }, // 코스에 대한 긴 설명
		isPrivate: { type: Boolean, required: true }, // 공개 여부
		transport: { type: [transportSchema], required: true }, // 이동 수단
		tags: { type: [String] }, // 태그
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

courseSchema.static(
	'findCourseByUUID',
	async function findCourseByUUID(courseUUID: string) {
		return this.findOne({ uuid: courseUUID, deletedAt: null });
	}
);

const CourseModel = model<CourseDAO, CourseDAOModel>('Course', courseSchema);

export { CourseModel, CourseDAO };
