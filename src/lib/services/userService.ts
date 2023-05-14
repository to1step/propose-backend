import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/converter/modelConverter';
import { User, LocalUser, UserCreateKey, UserCreateForm } from '../types/type';

class UserService {
	private static instance: UserService;

	private constructor() {}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	/**
	 * email로 유저 탐색
	 * @param userEmail
	 */
	async findUserByEmail(userEmail: string): Promise<User> {
		const user = await UserModel.findOne({ email: userEmail });

		if (!user) {
			throw new Error('cannot find user');
		}

		return ModelConverter.toUser(user);
	}

	async createUser<T extends UserCreateKey>(
		userData: UserCreateForm<T>
	): Promise<User> {
		const { email, password, nickname, provider, snsId } = userData;

		const newUUID = v4();

		const salt = await bcrypt.genSalt(10);

		// 소셜 로그인인 경우 비밀번호 null
		const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

		const user = await new UserModel({
			uuid: newUUID,
			email: email,
			password: hashedPassword,
			nickname: nickname,
			provider: provider,
			snsId: snsId,
		}).save();

		return ModelConverter.toUser(user);
	}
}

export default UserService;
