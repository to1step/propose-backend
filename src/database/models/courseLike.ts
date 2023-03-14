import { Model, model, Schema } from 'mongoose';

interface ICourseLike {
	user: string;
	course: string;
}

type ICourseLikeModel = Model<ICourseLike>;

const courseLikeSchema = new Schema<ICourseLike, ICourseLikeModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		course: { type: String, required: true }, // 코스 식별 uuid
	},
	{
		timestamps: true,
	}
);

const CourseLike = model<ICourseLike, ICourseLikeModel>(
	'CourseLike',
	courseLikeSchema
);

export { CourseLike };
