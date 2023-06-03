import { Model, model, Schema } from 'mongoose';

interface CourseLikeDAO {
	user: string;
	course: string;
	deletedAt: Date | null;
}

type CourseLikeDAOModel = Model<CourseLikeDAO>;

const courseLikeSchema = new Schema<CourseLikeDAO, CourseLikeDAOModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		course: { type: String, required: true }, // 코스 식별 uuid
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

const CourseLikeModel = model<CourseLikeDAO, CourseLikeDAOModel>(
	'CourseLike',
	courseLikeSchema
);

export { CourseLikeModel };
