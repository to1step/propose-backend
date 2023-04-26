import { IsNotEmpty, IsString } from 'class-validator';
import { EmailValidationForm } from '../type';

/**
 * @swagger
 * components:
 *    schemas:
 *      EmailValidationDto:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *            type: string
 *            description: 사용하려는 이메일
 *            example: aaa@example.com
 */

class EmailValidationDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	constructor(obj: EmailValidationDto) {
		this.email = obj.email;
	}

	toServiceModel(): EmailValidationForm {
		return {
			email: this.email,
		};
	}
}

export default EmailValidationDto;
