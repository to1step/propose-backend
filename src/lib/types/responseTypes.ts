import { User } from './type';

class UserDTO {
	uuid: string;

	email: string;

	nickname: string;

	provider: string;

	snsId: string | null;

	constructor(obj: User) {
		this.uuid = obj.uuid;
		this.email = obj.email;
		this.nickname = obj.nickname;
		this.provider = obj.provider;
		this.snsId = obj.snsId;
	}
}

export { UserDTO };
