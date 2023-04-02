import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/converter/modelConverter';
import { HashedUserData, User } from '../types/type';

class UserService {
	private static instance: UserService;

	private constructor() {}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	async createUser(hashedUserData: HashedUserData): Promise<User> {
		const { email, hashedPassword, nickname, provider, snsId } = hashedUserData;

		const newUUID = uuidv4();

		const user = await new UserModel({
			uuid: newUUID,
			email,
			hashedPassword,
			nickname,
			provider,
			snsId,
		}).save();

		return ModelConverter.toUser(user);
	}
}

export default UserService;
