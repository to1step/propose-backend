import { IsNotEmpty, IsString } from 'class-validator';
import { EmailValidationForm } from '../type';

class EmailValidationFormDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	constructor(obj: EmailValidationFormDto) {
		this.email = obj.email;
	}

	toServiceModel(): EmailValidationForm {
		return {
			email: this.email,
		};
	}
}

export default EmailValidationFormDto;
