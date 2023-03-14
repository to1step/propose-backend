import { Model, model, Schema } from 'mongoose';

interface ICourseReview {
	user: string;
	store: string;
	comment: string;
}

type ICourseReviewModel = Model<ICourseReview>;

const courseReviewSchema = new Schema<ICourseReview, ICourseReviewModel>(
	{
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		store: { type: String, required: true }, // 코스 식별 uuid
		comment: { type: String, required: true }, // 리뷰 내용
	},
	{
		timestamps: true,
	}
);

const CourseReview = model<ICourseReview, ICourseReviewModel>(
	'CourseReview',
	courseReviewSchema
);

export { CourseReview };
