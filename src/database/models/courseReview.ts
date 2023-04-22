import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseReview:
 *       type: object
 *       required:
 *         - user
 *         - course
 *         - comment
 *       properties:
 *         user:
 *           type: string
 *           description: 리뷰를 쓴 유저 식별 uuid
 *         course:
 *           type: string
 *           description: 유저가 리뷰를 쓴 코스 식별 uuid
 *         comment:
 *           type: string
 *           description: 리뷰 내용
 */

interface CourseReviewDAO {
	user: string;
	course: string;
	comment: string;
}

type CourseReviewDAOModel = Model<CourseReviewDAO>;

const courseReviewSchema = new Schema<CourseReviewDAO, CourseReviewDAOModel>(
	{
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		course: { type: String, required: true }, // 코스 식별 uuid
		comment: { type: String, required: true }, // 리뷰 내용
	},
	{
		timestamps: true,
	}
);

const CourseReview = model<CourseReviewDAO, CourseReviewDAOModel>(
	'CourseReview',
	courseReviewSchema
);

export { CourseReview };
