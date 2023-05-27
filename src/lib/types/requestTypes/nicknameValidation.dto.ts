import { IsNotEmpty, IsString } from 'class-validator';
import { NicknameValidationForm } from '../type';

class NicknameValidationDto {
	@IsString()
	@IsNotEmpty()
	nickname: string;

	constructor(obj: NicknameValidationDto) {
		this.nickname = obj.nickname;
	}

	toServiceModel(): NicknameValidationForm {
		return {
			nickname: this.nickname,
		};
	}
}

export default NicknameValidationDto;
