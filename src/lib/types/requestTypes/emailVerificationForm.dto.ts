import { IsNotEmpty, IsString } from 'class-validator';
import { EmailVerificationForm } from '../type';

type VerifyCodeDto = {
	verifyCode: string;
};

class EmailVerificationFormDto {
	@IsNotEmpty()
	@IsString()
	userToken: string | undefined;

	@IsNotEmpty()
	@IsString()
	verifyCode: string;

	constructor(userToken: string | undefined, obj: VerifyCodeDto) {
		this.userToken = userToken;
		this.verifyCode = obj.verifyCode;
	}

	toServiceModel(): EmailVerificationForm {
		return {
			userToken: this.userToken,
			verifyCode: this.verifyCode,
		};
	}
}

export default EmailVerificationFormDto;
