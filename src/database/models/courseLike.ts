import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseLike:
 *       type: object
 *       required:
 *         - user
 *         - course
 *       properties:
 *         user:
 *           type: string
 *           description: 좋아요 누른 유저 식별 uuid
 *         course:
 *           type: string
 *           description: 유저가 좋아요 누른 코스 식별 uuid
 */

interface CourseLikeDAO {
	user: string;
	course: string;
}

type CourseLikeDAOModel = Model<CourseLikeDAO>;

const courseLikeSchema = new Schema<CourseLikeDAO, CourseLikeDAOModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		course: { type: String, required: true }, // 코스 식별 uuid
	},
	{
		timestamps: true,
	}
);

const CourseLike = model<CourseLikeDAO, CourseLikeDAOModel>(
	'CourseLike',
	courseLikeSchema
);

export { CourseLike };
