import { IsNotEmpty, IsString } from 'class-validator';
import { ReVerifyEmailForm } from '../type';

class EmailReVerificationFormDto {
	@IsNotEmpty()
	@IsString()
	userToken: string | undefined;

	constructor(userToken: string | undefined) {
		this.userToken = userToken;
	}

	toServiceModel(): ReVerifyEmailForm {
		return {
			userToken: this.userToken,
		};
	}
}

export default EmailReVerificationFormDto;
