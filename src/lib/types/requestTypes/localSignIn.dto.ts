import { IsNotEmpty, IsString } from 'class-validator';
import { LocalSignInForm } from '../type';

class LocalSignInDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	constructor(obj: LocalSignInDto) {
		this.email = obj.email;
		this.password = obj.password;
	}

	toServiceModel(): LocalSignInForm {
		return {
			email: this.email,
			password: this.email,
		};
	}
}

export default LocalSignInDto;
