import { IsNotEmpty, IsString } from 'class-validator';
import { SendMailForm } from '../type';

/**
 * @swagger
 * components:
 *    schemas:
 *      UserDataDto:
 *        type: object
 *        required:
 *          - email
 *          - nickname
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: 유저 이메일
 *            example: aaa@example.com
 *          password:
 *            type: string
 *            description: 유저 비밀번호
 *            example: password123
 *          nickname:
 *            type: string
 *            description: 유저 닉네임
 *            example: minwoo123
 */

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
