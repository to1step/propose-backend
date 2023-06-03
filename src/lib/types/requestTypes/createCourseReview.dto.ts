import { IsString } from 'class-validator';
import { CreateCourseReviewForm } from '../type';

class CreateCourseReviewDto {
	@IsString()
	review: string;

	constructor(obj: CreateCourseReviewDto) {
		this.review = obj.review;
	}

	toServiceModel(): CreateCourseReviewForm {
		return {
			review: this.review,
		};
	}
}

export default CreateCourseReviewDto;
