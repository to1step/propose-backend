import jwt from 'jsonwebtoken';
import UserService from './userService';
import {
	EmailValidationForm,
	EmailVerifyCode,
	Tokens,
	LocalUser,
} from '../types/type';
import { UserModel } from '../../database/models/user';
import Redis from '../../utilies/redis';

const redis = Redis.getInstance();

class AuthService {
	private static instance: AuthService;

	userService: UserService;

	private constructor() {
		this.userService = UserService.getInstance();
	}

	/**
	 * 이메일 중복확인
	 * @param emailValidationForm
	 */
	async validateEmail(
		emailValidationForm: EmailValidationForm
	): Promise<boolean> {
		const { email } = emailValidationForm;

		const existEmail = await UserModel.exists({ email }).exec();

		return !!existEmail;
	}

	/**
	 * 이메일로 인증 코드 전송
	 * @param userData
	 * @param userIp
	 */
	async sendEmail(userData: LocalUser, userIp: string): Promise<void> {
		const { email, password, nickname } = userData;

		// 8자리 랜덤 문자열 생성
		const verifyCode = Math.random()
			.toString(36)
			.substring(2, 10)
			.toUpperCase();

		// email-[email]-[userIp]로 redis key 생성
		const redisKey = `email-${email}-${userIp}`;

		const { count } = await redis.getObjectData(redisKey);

		// count가 undefined이면 key가 존재하지 않으므로 생성해줌
		if (!count) {
			await redis.setObjectData(redisKey, {
				email,
				password,
				nickname,
				verifyCode,
				count: 1,
			});
			await redis.setExpireTime(redisKey, 630000);
		} else {
			const countNum = parseInt(count, 10);

			if (countNum === 6) {
				throw new Error('email send count exceeded 5 times');
			}

			// key가 같다면 덮어쓰므로 count와 인증코드만 재조정
			await redis.setObjectData(redisKey, { count: countNum + 1, verifyCode });
		}

		// TODO: AWS SES로 해당 이메일 인증코드 보내기
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

		// 이 값이 존재하지 않는다면 밑의 조건문에서 걸리므로 존재 판단 여부 생략
		const { email, nickname, password, verifyCode } = await redis.getObjectData(
			redisKey
		);

		// redis에 저장된 verifyCode와 유저가 보낸 code가 같은지 확인
		if (emailVerifyCode.code !== verifyCode) {
			throw new Error('invalid code');
		}

		// 같을시에 DB에 저장
		const { uuid } = await this.userService.createUser({
			email,
			password,
			nickname,
			provider: 'local',
			snsId: null,
		});

		return this.createTokens(uuid);
	}

	/**
	 * userUUID로 accessToken, refreshToken 만들기
	 * @param userUUID
	 */
	createTokens(userUUID: string): Tokens {
		const accessToken = jwt.sign(
			{ userUUId: userUUID },
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
			}
		);
		const refreshToken = jwt.sign(
			{ userUUId: userUUID },
			`${process.env.REFRESH_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
			}
		);

		return { accessToken, refreshToken };
	}

	// async kakaoLogin(code: string) {
	// 	const kakaoResponse = await axios<KakaoTokenResponse>({
	// 		method: 'post',
	// 		url: `https://kauth.kakao.com/oauth/token`,
	// 		params: {
	// 			grant_type: 'authorization_code',
	// 			client_id: `${process.env.KAKAO_CLIENT_ID}`,
	// 			redirect_uri: `${process.env.KAKAO_REDIRECT_URT}`,
	// 			code: `${code}`,
	// 		},
	// 		headers: { 'Content-type': 'application/x-www-form-urlencoded' },
	// 	});
	//
	// 	const kakaoAccessToken = kakaoResponse?.data?.access_token;
	//
	// 	if (!kakaoAccessToken) {
	// 		throw new Error('Kakao access token get fail');
	// 	}
	//
	// 	const userKaKaoData = await axios<KakaoUserReponse>({
	// 		method: 'post',
	// 		url: `https://kapi.kakao.com/v2/user/me`,
	// 		headers: {
	// 			Authorization: `Bearer ${kakaoAccessToken}`,
	// 		},
	// 	});
	//
	// 	const kakaoAccout = userKaKaoData?.data?.kakao_account;
	//
	// 	if (
	// 		!kakaoAccout ||
	// 		!kakaoAccout.email ||
	// 		!kakaoAccout.is_email_valid ||
	// 		!kakaoAccout.is_email_verified ||
	// 		!userKaKaoData?.data?.properties?.nickname
	// 	) {
	// 		기
	// 		throw new Error('axios error');
	// 	}
	//
	// 	const user = await this.userService.getUserWithSnsIDAndProvider(
	// 		`${userKaKaoData.data.id}`,
	// 		'kakao'
	// 	);
	//
	// 	//TODO: 수정
	//
	// 	// 새 유저인 경우
	// 	if (!user) {
	// 		if (
	// 			userData?.data?.kakao_account?.is_email_verified &&
	// 			userData?.data?.kakao_account?.is_email_valid
	// 		) {
	// 			const newUser = await UserService.createUser(
	// 				userData.data.kakao_account.email,
	// 				userData.data.properties.nickname,
	// 				'kakao',
	// 				`${userData.data.id}`
	// 			);
	//
	// 			// accessToken, refreshToken발급
	// 			const accessToken = AuthService.makeAccessToken(newUser.uuid);
	// 			const refreshToken = AuthService.makeRefreshToken(newUser.uuid);
	//
	// 			// [redis에 refreshToken저장코드]
	//
	// 			// front cookie에 token저장
	// 			return res
	// 				.cookie('AccessToken', accessToken, {
	// 					expires: new Date(Date.now() + 900000),
	// 					httpOnly: true,
	// 				})
	// 				.cookie('RefreshToken', refreshToken, {
	// 					expires: new Date(Date.now() + 900000),
	// 					httpOnly: true,
	// 				})
	// 				.redirect(301, `${process.env.FRONT_PORT}`);
	//
	// 			// res에서 return을 꼭 해주어야하는가
	// 		}
	//
	// 		return res.json({
	// 			test: 'test',
	// 		});
	// 	}
	//
	// 	// accessToken, refreshToken발급
	// 	const accessToken = AuthService.makeAccessToken(user.uuid);
	// 	const refreshToken = AuthService.makeRefreshToken(user.uuid);
	//
	// 	// [redis에 refreshToken저장코드]
	//
	// 	// front cookie에 token저장
	// 	return res
	// 		.cookie('AccessToken', accessToken, {
	// 			expires: new Date(Date.now() + 900000),
	// 			httpOnly: true,
	// 		})
	// 		.cookie('RefreshToken', refreshToken, {
	// 			expires: new Date(Date.now() + 900000),
	// 			httpOnly: true,
	// 		})
	// 		.redirect(301, `${process.env.FRONT_PORT}`);
	// }

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}
}

export default AuthService;
