import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import UserService from './userService';
import {
	LocalSignInForm,
	EmailValidationForm,
	EmailVerifyCode,
	Tokens,
	SendMailForm,
	NicknameValidationForm,
	KakaoUserReponse,
	KakaoTokenResponse,
} from '../types/type';
import { UserModel } from '../../database/models/user';
import Redis from '../../utilies/redis';
import SESClient from '../../utilies/sesClient';
import WinstonLogger from '../../utilies/logger';
import NodeMailer from '../../utilies/nodeMailer';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';

const redis = Redis.getInstance().getClient();
const sesClient = SESClient.getInstance();
const logger = WinstonLogger.getInstance();
const nodeMailer = NodeMailer.getInstance();

class AuthService {
	private static instance: AuthService;

	userService: UserService;

	private constructor() {
		this.userService = UserService.getInstance();
	}

	/**
	 * 로컬 로그인
	 * @param localSignInForm
	 */
	async localSignIn(localSignInForm: LocalSignInForm): Promise<Tokens> {
		const { email, password } = localSignInForm;

		// 이메일로 DB에서 유저 탐색
		const user = await this.userService.findUserByEmail(email);

		const userUUID = user.uuid;
		const userPassword = user.password;

		// 비밀번호가 존재하지 않거나, provider가 local이 아니면 잘못된 로그인 방식
		if (!userPassword || !(user.provider === 'local')) {
			throw new BadRequestError(ErrorCode.INVALID_LOGIN, [
				{ data: 'Invalid login' },
			]);
		}

		// DB의 비밀번호와 유저가 보낸 비밀번호 비교
		const compare = await bcrypt.compare(password, userPassword);

		// 틀릴시 에러
		if (!compare) {
			throw new BadRequestError(ErrorCode.WRONG_PASSWORD, [
				{ data: 'Wrong password' },
			]);
		}

		// accessToken, refreshToken 생성
		const { accessToken, refreshToken } = this.createTokens(userUUID);

		// refreshToken은 redis에 key: userUUID / value: refreshToken으로 저장
		await this.saveRefreshTokenToRedis(userUUID, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * 이메일 중복확인
	 * @param emailValidationForm
	 */
	async validateEmail(
		emailValidationForm: EmailValidationForm
	): Promise<boolean> {
		const { email } = emailValidationForm;

		const existEmail = await UserModel.exists({ email: email });

		return !!existEmail;
	}

	/**
	 * 닉네임 중복확인
	 * @param nicknameValidationForm
	 */
	async validateNickname(
		nicknameValidationForm: NicknameValidationForm
	): Promise<boolean> {
		const { nickname } = nicknameValidationForm;

		const existNickname = await UserModel.exists({ nickname: nickname });

		return !!existNickname;
	}

	/**
	 * 이메일로 인증 코드 전송
	 * @param userData
	 * @param userIp
	 */
	async sendEmail(userData: SendMailForm, userIp: string): Promise<void> {
		const { email, password, nickname } = userData;

		// 8자리 랜덤 문자열 생성
		const verifyCode = Math.random()
			.toString(36)
			.substring(2, 10)
			.toUpperCase();

		// email-[email]-[userIp]로 redis key 생성
		const redisKey = `email-${email}-${userIp}`;

		// 해당 key에 대한 value가져오기
		const tempUserData = await redis.hGetAll(redisKey);

		//  없는지 check
		if (
			!tempUserData.email ||
			!tempUserData.password ||
			!tempUserData.nickname ||
			!tempUserData.verifyCode ||
			!tempUserData.count
		) {
			// multi를 사용하여 set과 expire transacion 수행
			await redis
				.multi()
				.hSet(redisKey, {
					email,
					password,
					nickname,
					verifyCode,
					count: 1,
				})
				.pExpire(redisKey, 630000)
				.exec();
		} else {
			const countNum = parseInt(tempUserData.count, 10);

			// 요청 5회 초과시 에러
			if (6 <= countNum) {
				await redis.del(redisKey);

				throw new BadRequestError(ErrorCode.EMAIL_SEND_EXCEED, [
					{ data: 'Email send exceeded 5 times' },
				]);
			}

			// key가 같다면 덮어쓰므로 count와 인증코드만 재조정
			await redis
				.multi()
				.hSet(redisKey, { count: countNum + 1, verifyCode })
				.pExpire(redisKey, 630000)
				.exec();
		}

		// AWS-SES를 통해 해당 이메일로 인증코드 보내기
		nodeMailer.sendMail(email, verifyCode);
	}

	/**
	 * client가 보낸 code와 redis에서 찾은 code가 같을 시 DB에 유저 저장
	 * @param emailVerifyCode
	 * @param userIp
	 */
	async verifyEmail(
		emailVerifyCode: EmailVerifyCode,
		userIp: string
	): Promise<Tokens> {
		const redisKey = `email-${emailVerifyCode.email}-${userIp}`;

		const { email, password, nickname, verifyCode } = await redis.hGetAll(
			redisKey
		);

		// 값 없는지 check
		if (!email || !password || !nickname || !verifyCode) {
			throw new BadRequestError(ErrorCode.EMAIL_SEND_EXCEED, [
				{ data: 'Email send exceeded 5 times' },
			]);
		}

		// redis에 저장된 verifyCode와 유저가 보낸 code가 같은지 확인
		if (verifyCode !== emailVerifyCode.code) {
			throw new BadRequestError(ErrorCode.WRONG_VERIFY_CODE, [
				{ data: 'Wrong verify code' },
			]);
		}

		// 같을시에 DB에 저장
		const { uuid } = await this.userService.createUser<'local'>({
			email,
			password,
			nickname,
			provider: 'local',
			snsId: null,
		});

		return this.createTokens(uuid);
	}

	async kakaoLogin(code: string): Promise<Tokens> {
		const kakaoToken = await axios.post<KakaoTokenResponse>(
			`https://kauth.kakao.com/oauth/token`,
			{},
			{
				params: {
					grant_type: 'authorization_code',
					client_id: `${process.env.KAKAO_CLIENT_ID}`,
					redirect_uri: `${process.env.KAKAO_REDIRECT_URI}`,
					code: code,
				},
				headers: {
					'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
				},
			}
		);

		const kakaoAccessToken = kakaoToken?.data?.access_token;

		if (!kakaoAccessToken) {
			throw new InternalServerError(ErrorCode.KAKAO_LOGIN_ERROR, [
				{ data: 'Kakao access token get fail' },
			]);
		}

		const userKaKaoData = await axios.post<KakaoUserReponse>(
			`https://kapi.kakao.com/v2/user/me`,
			{},
			{
				headers: {
					Authorization: `Bearer ${kakaoAccessToken}`,
				},
			}
		);

		const kakaoAccout = userKaKaoData?.data?.kakao_account;

		if (
			!kakaoAccout ||
			!kakaoAccout.email ||
			!kakaoAccout.is_email_valid ||
			!kakaoAccout.is_email_verified ||
			!kakaoAccout?.profile?.nickname
		) {
			throw new BadRequestError(ErrorCode.KAKAO_LOGIN_ERROR, [
				{ data: 'email, nickname is required' },
			]);
		}

		const user = await UserModel.findOne({ email: kakaoAccout.email });

		let userUUID: string;

		// 새 유저인 경우
		if (!user) {
			const newUser = await this.userService.createUser<'kakao'>({
				email: kakaoAccout.email,
				nickname: kakaoAccout.profile.nickname,
				provider: 'kakao',
				snsId: userKaKaoData.data.id.toString(),
				password: null,
			});

			userUUID = newUser.uuid;
			logger.info(`${newUser.email} sign-up`);
		} else {
			userUUID = user.uuid;
			logger.info(`${user.email} sign-in`);
		}

		// accessToken, refreshToken 생성
		const { accessToken, refreshToken } = this.createTokens(userUUID);

		// refreshToken은 redis에 key: userUUID / value: refreshToken으로 저장
		await this.saveRefreshTokenToRedis(userUUID, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * 토큰 재발급
	 * @param userUUID
	 */
	reissue(userUUID: string): string {
		// 토큰 인증 성공 accessToken재 발급
		return jwt.sign(
			{ userUUID: userUUID },
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_TIME}`,
			}
		);
	}

	/**
	 * 로그아웃 redis에서 유저의 refreshToken삭제
	 * @param userUUID
	 */
	async signOut(userUUID: string): Promise<void> {
		// redis에서 해당 유저의 refreshToken 삭제
		await redis.del(`${userUUID}`);
	}

	/**
	 * refreshToken redis에 저장
	 * @param userUUID
	 * @param refreshToken
	 */
	async saveRefreshTokenToRedis(
		userUUID: string,
		refreshToken: string
	): Promise<void> {
		await redis
			.multi()
			.set(userUUID, refreshToken)
			.pExpire(userUUID, 86400000)
			.exec();
	}

	/**
	 * userUUID로 accessToken, refreshToken 만들기
	 * @param userUUID
	 */
	createTokens(userUUID: string): Tokens {
		const accessToken = jwt.sign(
			{ userUUID: userUUID },
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_TIME}`,
			}
		);
		const refreshToken = jwt.sign(
			{ userUUID: userUUID },
			`${process.env.REFRESH_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_TIME}`,
			}
		);

		return { accessToken, refreshToken };
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}
}

export default AuthService;
