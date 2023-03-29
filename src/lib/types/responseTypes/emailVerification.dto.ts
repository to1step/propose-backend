import { EmailVerification } from '../type';

class EmailVerificationDto {
	verify: boolean;

	timeOut: boolean;

	constructor(obj: EmailVerification) {
		this.verify = obj.verify;
		this.timeOut = obj.timeOut;
	}
}

export default EmailVerificationDto;
