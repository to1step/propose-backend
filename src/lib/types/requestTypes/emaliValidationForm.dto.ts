import { IsNotEmpty, IsString } from 'class-validator';
import { EmailValidationForm } from '../type';

class EmailValidationFormDto {
	@IsNotEmpty()
	@IsString()
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

// TODO: export default로 하기
export default EmailValidationFormDto;
