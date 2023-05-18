import { IsString } from 'class-validator';
import { UpdateStoreReviewForm } from '../type';

class UpdateStorRevieweDto {
	@IsString()
	storeReviewUUID: string;

	@IsString()
	review: string;

	constructor(obj: UpdateStorRevieweDto) {
		this.storeReviewUUID = obj.storeReviewUUID;
		this.review = obj.review;
	}

	toServiceModel(): UpdateStoreReviewForm {
		return {
			storeReviewUUID: this.storeReviewUUID,
			review: this.review,
		};
	}
}

export default UpdateStorRevieweDto;
