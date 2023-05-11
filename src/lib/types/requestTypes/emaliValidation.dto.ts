import { IsNotEmpty, IsString } from 'class-validator';
import { EmailValidationForm } from '../type';

class EmailValidationDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	constructor(obj: EmailValidationDto) {
		this.email = obj.email;
	}

	toServiceModel(): EmailValidationForm {
		return {
			email: this.email,
		};
	}
}

export default EmailValidationDto;
