import { UserDAO } from '../../database/models/user';
import { User } from '../../lib/types/type';

class ModelConverter {
	static toUser(user: UserDAO): User {
		return {
			uuid: user.uuid,
			email: user.email,
			password: user.password,
			nickname: user.nickname,
			snsId: user.snsId,
			provider: user.provider,
		};
	}
}

export default ModelConverter;
