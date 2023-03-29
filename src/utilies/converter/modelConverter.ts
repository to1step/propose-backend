import { UserDAO } from '../../database/models/user';

class ModelConverter {
	static toUser(user: UserDAO): string {
		return user.uuid;
	}
}

export default ModelConverter;
