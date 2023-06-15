import { IsString } from 'class-validator';
import { ChangeNicknameForm } from '../type';

class ChangeNicknameDto {
	@IsString()
	nickname: string;

	constructor(obj: ChangeNicknameDto) {
		this.nickname = obj.nickname;
	}

	toServiceModel(): ChangeNicknameForm {
		return {
			nickname: this.nickname,
		};
	}
}

export default ChangeNicknameDto;
