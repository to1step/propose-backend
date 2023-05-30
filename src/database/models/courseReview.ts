import { Model, model, Schema } from 'mongoose';

interface CourseReviewDAO {
	uuid: string;
	user: string;
	course: string;
	review: string;
	deletedAt: Date | null;
}

interface CourseReviewDAOModel extends Model<CourseReviewDAO> {
	findCourseReviewByStore(courseUUID: string): Promise<CourseReviewDAO[]>;
}

const courseReviewSchema = new Schema<CourseReviewDAO, CourseReviewDAOModel>(
	{
		uuid: { type: String, required: true }, // 코스 리뷰 식별 uuid
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		course: { type: String, required: true }, // 코스 식별 uuid
		review: { type: String, required: true }, // 리뷰 내용
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

courseReviewSchema.static(
	'findCourseReviewByStore',
	function findCourseReviewByStore(courseUUID: string) {
		return this.find({
			course: courseUUID,
			deletedAt: null,
		});
	}
);

const CourseReviewModel = model<CourseReviewDAO, CourseReviewDAOModel>(
	'CourseReview',
	courseReviewSchema
);

export { CourseReviewModel, CourseReviewDAO };
