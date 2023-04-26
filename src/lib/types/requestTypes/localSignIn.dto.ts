import { IsNotEmpty, IsString } from 'class-validator';
import { LocalSignInForm } from '../type';

/**
 * @swagger
 * components:
 *    schemas:
 *      LocalSignInDto:
 *        type: object
 *        required:
 *          - email
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
 */

class LocalSignInDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	constructor(obj: LocalSignInDto) {
		this.email = obj.email;
		this.password = obj.password;
	}

	toServiceModel(): LocalSignInForm {
		return {
			email: this.email,
			password: this.email,
		};
	}
}

export default LocalSignInDto;
