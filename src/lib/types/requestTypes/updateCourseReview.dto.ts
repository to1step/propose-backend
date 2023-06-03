import { IsString } from 'class-validator';
import { UpdateCourseReviewForm } from '../type';

class UpdateCourseReviewDto {
	@IsString()
	review: string;

	constructor(obj: UpdateCourseReviewDto) {
		this.review = obj.review;
	}

	toServiceModel(): UpdateCourseReviewForm {
		return {
			review: this.review,
		};
	}
}

export default UpdateCourseReviewDto;
