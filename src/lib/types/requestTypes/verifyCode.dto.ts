import { IsNotEmpty, IsString } from 'class-validator';
import { VerifyCode } from '../type';

class VerifyCodeDto {
	@IsString()
	@IsNotEmpty()
	code: string;

	constructor(obj: VerifyCodeDto) {
		this.code = obj.code;
	}

	toServiceModel(): VerifyCode {
		return {
			code: this.code,
		};
	}
}

export default VerifyCodeDto;
