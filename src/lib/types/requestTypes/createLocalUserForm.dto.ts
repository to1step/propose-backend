import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UserLocalCreateForm } from '../type';

class CreateLocalUserFormDto {
	@IsNotEmpty()
	@IsBoolean()
	verify: boolean;

	constructor(obj: CreateLocalUserFormDto) {
		this.verify = obj.verify;
	}

	toServiceModel(): UserLocalCreateForm {
		return {
			verify: this.verify,
		};
	}
}

export default CreateLocalUserFormDto;
