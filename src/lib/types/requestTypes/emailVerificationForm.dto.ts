import { IsNotEmpty, IsString } from 'class-validator';
import { EmailVerificationForm } from '../type';

class EmailVerificationFormDto {
	@IsNotEmpty()
	@IsString()
	verifyCode: string;

	constructor(obj: EmailVerificationFormDto) {
		this.verifyCode = obj.verifyCode;
	}

	toServiceModel(): EmailVerificationForm {
		return {
			verifyCode: this.verifyCode,
		};
	}
}

export default EmailVerificationFormDto;
