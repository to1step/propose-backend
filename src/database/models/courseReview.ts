import { Model, model, Schema } from 'mongoose';

interface ICourseReview {
	userUUID: string;
	storeUUID: string;
	comment: string;
}

type ICourseReviewModel = Model<ICourseReview>;

const courseReviewSchema = new Schema<ICourseReview, ICourseReviewModel>({
	userUUID: { type: String, required: true },
	storeUUID: { type: String, required: true },
	comment: { type: String, required: true },
});

const CourseReview = model<ICourseReview, ICourseReviewModel>(
	'CourseReview',
	courseReviewSchema
);

export { CourseReview };
