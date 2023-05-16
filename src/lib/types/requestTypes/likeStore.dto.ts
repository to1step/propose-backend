import { IsString } from 'class-validator';
import { LikeStoreForm } from '../type';

class LikeStoreDto {
	@IsString()
	storeUUID: string;

	constructor(obj: LikeStoreDto) {
		this.storeUUID = obj.storeUUID;
	}

	toServiceModel(): LikeStoreForm {
		return {
			storeUUID: this.storeUUID,
		};
	}
}

export default LikeStoreDto;
