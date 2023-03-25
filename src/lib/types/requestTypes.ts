import { IsOptional, IsString } from 'class-validator';
import { UserLocalCreate } from './type';

class UserLocalCreateDTO {
	@IsString()
	email: string;

	@IsString()
	nickname: string;

	@IsString()
	provider: string;

	@IsOptional()
	@IsString()
	snsId: string | null;

	constructor(obj: UserLocalCreateDTO) {
		this.email = obj.email;
		this.nickname = obj.nickname;
		this.provider = 'local';
		this.snsId = obj.snsId ?? null;
	}

	toServiceModel(): UserLocalCreate {
		return {
			email: this.email,
			nickname: this.nickname,
			provider: this.provider,
			snsId: this.snsId,
		};
	}
}

export { UserLocalCreateDTO };
