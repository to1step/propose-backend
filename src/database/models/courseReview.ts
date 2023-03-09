import { Model, model, Schema } from 'mongoose';

interface ICourseReview {
	userUUID: string;
	storeUUID: string;
	comment: string;
}

type ICourseReviewModel = Model<ICourseReview>;

const courseReviewSchema = new Schema<ICourseReview, ICourseReviewModel>({
	userUUID: { type: String, required: true }, // 작성한 유저 식별 uuid
	storeUUID: { type: String, required: true }, // 코스 식별 uuid
	comment: { type: String, required: true }, // 리뷰 내용
});

const CourseReview = model<ICourseReview, ICourseReviewModel>(
	'CourseReview',
	courseReviewSchema
);

export { CourseReview };
