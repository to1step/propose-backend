import { IsString } from 'class-validator';
import { CreateStoreReviewForm } from '../type';

class CreateStorRevieweDto {
	@IsString()
	review: string;

	constructor(obj: CreateStorRevieweDto) {
		this.review = obj.review;
	}

	toServiceModel(): CreateStoreReviewForm {
		return {
			review: this.review,
		};
	}
}

export default CreateStorRevieweDto;
