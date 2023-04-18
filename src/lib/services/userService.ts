import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/converter/modelConverter';
import { User, LocalUser } from '../types/type';

class UserService {
	private static instance: UserService;

	private constructor() {}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	async findUserByEmail(userEmail: string): Promise<User> {
		const user = await UserModel.findOne({ email: userEmail });

		if (!user) {
			throw new Error('cannot find user');
		}

		return ModelConverter.toUser(user);
	}

	async createUser(userData: LocalUser): Promise<User> {
		const { email, password, nickname, provider, snsId } = userData;

		const newUUID = v4();

		const salt = await bcrypt.genSalt(10);
		// 소셜 로그인인 경우 비밀번호 null
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
