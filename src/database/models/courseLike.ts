import { Model, model, Schema } from 'mongoose';

interface ICourseLike {
	userUUID: string;
	courseUUID: string;
}

type ICourseLikeModel = Model<ICourseLike>;

const courseLikeSchema = new Schema<ICourseLike, ICourseLikeModel>({
	userUUID: { type: String, required: true },
	courseUUID: { type: String, required: true },
});

const CourseLike = model<ICourseLike, ICourseLikeModel>(
	'CourseLike',
	courseLikeSchema
);

export { CourseLike };
