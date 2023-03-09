import { Model, model, Schema } from 'mongoose';

interface ICourseLike {
	userUUID: string;
	courseUUID: string;
}

type ICourseLikeModel = Model<ICourseLike>;

const courseLikeSchema = new Schema<ICourseLike, ICourseLikeModel>({
	userUUID: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
	courseUUID: { type: String, required: true }, // 코스 식별 uuid
});

const CourseLike = model<ICourseLike, ICourseLikeModel>(
	'CourseLike',
	courseLikeSchema
);

export { CourseLike };
