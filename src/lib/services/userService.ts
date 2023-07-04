import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/converter/modelConverter';
import {
	ChangeProfileForm,
	User,
	UserCreateForm,
	UserCreateKey,
} from '../types/type';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';

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
			throw new BadRequestError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}

		return ModelConverter.toUser(user);
	}

	/**
	 * 유저 생성
	 * @param userData
	 */
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

	/**
	 * 나의 정보 모두 가져오기
	 * @param userUUID
	 */
	async getProfile(userUUID: string): Promise<User> {
		const user = await UserModel.findOne({
			uuid: userUUID,
			deletedAt: null,
		});

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}

		return ModelConverter.toUser(user);
	}

	/**
	 * 개인정보 변경하기
	 * @param changeProfileForm
	 * @param userUUID
	 */
	async changeProfile(
		changeProfileForm: ChangeProfileForm,
		userUUID: string
	): Promise<void> {
		const { nickname, profileImage, commentAlarm, updateAlarm } =
			changeProfileForm;

		const user = await UserModel.findOne({ uuid: userUUID, deletedAt: null });

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}

		user.nickname = nickname;
		user.profileImage = profileImage;
		user.commentAlarm = commentAlarm;
		user.updateAlarm = updateAlarm;

		await user.save();
	}

	/**
	 * 회원 탈퇴
	 * @param userUUID
	 */
	async deleteUser(userUUID: string): Promise<void> {
		const user = await UserModel.findOne({
			uuid: userUUID,
			deletedAt: null,
		});

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}

		user.deletedAt = new Date();
		await user.save();
	}
}

export default UserService;
