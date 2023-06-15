import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserModel } from '../../database/models/user';
import ModelConverter from '../../utilies/converter/modelConverter';
import {
	ChangeNicknameForm,
	ChangeProfileImageForm,
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
	 * 닉네임 변경하기
	 * @param changeNicknameForm
	 * @param userUUID
	 */
	async changeNickname(
		changeNicknameForm: ChangeNicknameForm,
		userUUID: string
	): Promise<void> {
		const { nickname } = changeNicknameForm;
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				nickname: nickname,
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 프로필 사진 변경하기
	 * @param changeProfileImageForm
	 * @param userUUID
	 */
	async changeProfileImage(
		changeProfileImageForm: ChangeProfileImageForm,
		userUUID: string
	): Promise<void> {
		const { imageSrc } = changeProfileImageForm;
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				profileImage: imageSrc,
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 프로필 사진 기본이미지로 변경하기
	 * @param userUUID
	 */
	async deleteProfileImage(userUUID: string): Promise<void> {
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				// TODO: 기본 이미지 s3에 저장한다음 이 부분 수정
				profileImage: 'basic.png',
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 댓글 알림 off
	 * @param userUUID
	 */
	async commentAlarmOff(userUUID: string): Promise<void> {
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				commentAlarm: false,
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 댓글 알림 on
	 * @param userUUID
	 */
	async commentAlarmOn(userUUID: string): Promise<void> {
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				commentAlarm: true,
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 업데이트 알림 off
	 * @param userUUID
	 */
	async updateAlarmOff(userUUID: string): Promise<void> {
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				updateAlarm: false,
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 업데이트 알림 on
	 * @param userUUID
	 */
	async updateAlarmOn(userUUID: string): Promise<void> {
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				updateAlarm: true,
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}

	/**
	 * 회원 탈퇴
	 * @param userUUID
	 */
	async deleteUser(userUUID: string): Promise<void> {
		const user = await UserModel.findOneAndUpdate(
			{
				uuid: userUUID,
				deletedAt: null,
			},
			{
				deletedAt: new Date(),
			},
			{ new: true }
		);

		if (!user) {
			throw new InternalServerError(ErrorCode.USER_NOT_FOUND, [
				{ data: 'User not found' },
			]);
		}
	}
}

export default UserService;
