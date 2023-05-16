import { IsString } from 'class-validator';
import { UnlikeStoreForm } from '../type';

class UnlikeStoreDto {
	@IsString()
	storeUUID: string;

	constructor(obj: UnlikeStoreDto) {
		this.storeUUID = obj.storeUUID;
	}

	toServiceModel(): UnlikeStoreForm {
		return {
			storeUUID: this.storeUUID,
		};
	}
}

export default UnlikeStoreDto;
