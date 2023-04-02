import { IsNotEmpty, IsString } from 'class-validator';
import { SignUpForm } from '../type';

class SignUpFormDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	nickname: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	constructor(obj: SignUpFormDto) {
		this.email = obj.email;
		this.nickname = obj.nickname;
		this.password = obj.password;
	}

	toServiceModel(): SignUpForm {
		return {
			email: this.email,
			nickname: this.nickname,
			password: this.password,
			provider: 'local',
			snsId: null,
		};
	}
}

export default SignUpFormDto;
