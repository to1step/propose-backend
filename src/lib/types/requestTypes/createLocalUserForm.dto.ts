import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UserLocalCreateForm } from '../type';

type VerifyDto = {
	verify: boolean;
};

class CreateLocalUserFormDto {
	@IsNotEmpty()
	@IsString()
	userToken: string | undefined;

	@IsNotEmpty()
	@IsBoolean()
	verify: boolean;

	constructor(userToken: string | undefined, obj: VerifyDto) {
		this.userToken = userToken;
		this.verify = obj.verify;
	}

	toServiceModel(): UserLocalCreateForm {
		return {
			userToken: this.userToken,
			verify: this.verify,
		};
	}
}

export default CreateLocalUserFormDto;
