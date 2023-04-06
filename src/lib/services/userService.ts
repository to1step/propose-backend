import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/converter/modelConverter';
import { User, UserData } from '../types/type';

class UserService {
	private static instance: UserService;

	private constructor() {}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	async createUser(userData: UserData): Promise<User> {
		const { email, password, nickname, provider, snsId } = userData;

		const newUUID = uuidv4();

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

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
