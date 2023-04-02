import { VerifyResult } from '../type';

class EmailVerificationDto {
	verify: boolean;

	timeOut: boolean;

	constructor(obj: VerifyResult) {
		this.verify = obj.verify;
		this.timeOut = obj.timeOut;
	}
}

export default EmailVerificationDto;
