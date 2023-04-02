import { IsNotEmpty, IsString } from 'class-validator';
import { UserData } from '../type';

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

	toServiceModel(): UserData {
		return {
			email: this.email,
			nickname: this.nickname,
			password: this.password,
			provider: 'local',
			snsId: null,
		};
	}
}

export default UserDataDto;
