import { IsNotEmpty, IsString } from 'class-validator';
import { EmailVerifyCode } from '../type';

/**
 * @swagger
 * components:
 *    schemas:
 *      emailVerificationDto:
 *       properties:
 *               email:
 *                 type: string
 *                 description: 유저 이메일
 *                 example: aaa@example.com
 *               nickname:
 *                 type: string
 *                 description: 유저 닉네임
 *                 example: minwoo123
 *               password:
 *                 type: string
 *                 description: 유저 비밀번호
 *                 example: password123
 */

class EmailVerificationDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	code: string;

	constructor(obj: EmailVerificationDto) {
		this.email = obj.email;
		this.code = obj.code;
	}

	toServiceModel(): EmailVerifyCode {
		return {
			email: this.email,
			code: this.code,
		};
	}
}

export default EmailVerificationDto;
