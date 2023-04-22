import { IsNotEmpty, IsString } from 'class-validator';
import { SendMailForm } from '../type';

class UserDataDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	nickname: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	constructor(obj: UserDataDto) {
		this.email = obj.email;
		this.nickname = obj.nickname;
		this.password = obj.password;
	}

	toServiceModel(): SendMailForm {
		return {
			email: this.email,
			nickname: this.nickname,
			password: this.password,
		};
	}
}

export default UserDataDto;
