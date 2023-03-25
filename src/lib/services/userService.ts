import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/modelConverter';
import { User, UserLocalCreate } from '../types/type';

dotenv.config();

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
	 * 유저 생성
	 * @param userCreateForm
	 */
	async createUser(userCreateForm: UserLocalCreate): Promise<User> {
		const newUUID = uuidv4();
		const { email, nickname, provider, snsId } = userCreateForm;

		const newUser = await new UserModel({
			uuid: newUUID,
			email,
			nickname,
			provider,
			snsId,
		}).save();

		return ModelConverter.toUser(newUser);
	}

	async getUserWithSnsIDAndProvider(
		snsId: string | null,
		provider: 'kakao' | 'naver' | 'google' | 'local'
	): Promise<User | null> {
		const user = await UserModel.findOne({
			snsId,
			provider,
		}).exec();

		if (!user) {
			return null;
		}

		return ModelConverter.toUser(user);
	}
}

export default UserService;
