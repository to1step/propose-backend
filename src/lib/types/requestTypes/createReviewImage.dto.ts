import { IsString } from 'class-validator';
import { CreateStoreReviewImageForm } from '../type';

class CreateReviewImageDto {
	@IsString()
	src: string;

	constructor(obj: CreateReviewImageDto) {
		this.src = obj.src;
	}

	toServiceModel(): CreateStoreReviewImageForm {
		return {
			src: this.src,
		};
	}
}

export default CreateReviewImageDto;
