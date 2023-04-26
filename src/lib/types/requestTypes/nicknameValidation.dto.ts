import { IsNotEmpty, IsString } from 'class-validator';
import { NicknameValidationForm } from '../type';

/**
 * @swagger
 * components:
 *    schemas:
 *      NicknameValidationDto:
 *        type: object
 *        required:
 *        - nickname
 *        properties:
 *          nickname:
 *            type: string
 *            description: 사용하려는 닉네임
 *            example: minwoo123
 */

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
