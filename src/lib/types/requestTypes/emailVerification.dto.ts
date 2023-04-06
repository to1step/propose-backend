import { IsNotEmpty, IsString } from 'class-validator';
import { EmailVerifyCode } from '../type';

class EmailVerificationDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	code: string;

	constructor(obj: EmailVerificationDto) {
		this.email = obj.email;
		this.code = obj.code;
	}

	toServiceModel(): EmailVerifyCode {
		return {
			email: this.email,
			code: this.code,
		};
	}
}

export default EmailVerificationDto;
