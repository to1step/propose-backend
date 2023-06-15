import { IsString } from 'class-validator';
import { ChangeProfileImageForm } from '../type';

class ChangeNicknameDto {
	@IsString()
	imageSrc: string;

	constructor(obj: ChangeNicknameDto) {
		this.imageSrc = obj.imageSrc;
	}

	toServiceModel(): ChangeProfileImageForm {
		return {
			imageSrc: this.imageSrc,
		};
	}
}

export default ChangeNicknameDto;
