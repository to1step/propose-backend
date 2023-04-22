import { Model, model, Schema } from 'mongoose';

interface CourseReviewDAO {
	user: string;
	store: string;
	comment: string;
}

type CourseReviewDAOModel = Model<CourseReviewDAO>;

const courseReviewSchema = new Schema<CourseReviewDAO, CourseReviewDAOModel>(
	{
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		store: { type: String, required: true }, // 코스 식별 uuid
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
