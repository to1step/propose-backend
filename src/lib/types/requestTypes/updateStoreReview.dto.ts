import { IsString } from 'class-validator';
import { UpdateStoreReviewForm } from '../type';

class UpdateStorRevieweDto {
	@IsString()
	review: string;

	constructor(obj: UpdateStorRevieweDto) {
		this.review = obj.review;
	}

	toServiceModel(): UpdateStoreReviewForm {
		return {
			review: this.review,
		};
	}
}

export default UpdateStorRevieweDto;
