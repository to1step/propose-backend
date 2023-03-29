import { EmailValidation } from '../type';

class EmailValidationDto {
	exist: boolean;

	constructor(obj: EmailValidation) {
		this.exist = obj.exist;
	}
}

export default EmailValidationDto;
