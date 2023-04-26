import { IsNotEmpty, IsString } from 'class-validator';
import { EmailVerifyCode } from '../type';

/**
 * @swagger
 * components:
 *    schemas:
 *      EmailVerificationDto:
 *        type: object
 *        required:
 *          - email
 *          - code
 *        properties:
 *          email:
 *            type: string
 *            description: 유저 이메일
 *            example: aaa@example.com
 *          code:
 *            type: string
 *            description: 해당 이메일로 전송된 8자리 인증번호
 *            example: 8JS4KF2D
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
