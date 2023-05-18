import { IsString } from 'class-validator';
import { CreateStoreReviewForm } from '../type';

class CreateStorRevieweDto {
	@IsString()
	storeUUID: string;

	@IsString()
	review: string;

	constructor(obj: CreateStorRevieweDto) {
		this.storeUUID = obj.storeUUID;
		this.review = obj.review;
	}

	toServiceModel(): CreateStoreReviewForm {
		return {
			storeUUID: this.storeUUID,
			review: this.review,
		};
	}
}

export default CreateStorRevieweDto;
