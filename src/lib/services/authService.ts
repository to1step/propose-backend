import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserService from './userService';
import {
	UserData,
	EmailValidationForm,
	VerifyCode,
	VerifyResult,
	Tokens,
	HashedUserData,
} from '../types/type';
import { UserModel } from '../../database/models/user';

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
	 * 유저정보를 토큰에 저장, 해당 이메일로 인증메일을 보냄
	 * @param userData
	 */
	async userToToken(userData: UserData): Promise<string> {
		const { email } = userData;

		this.sendEmail(email);

		return this.createUserToken(userData);
	}

	/**
	 * 이메일로 인증 코드 전송
	 * @param email
	 */
	sendEmail(email: string): void {
		// TODO: 해당 이메일에 대한 인증코드 만들기 8자리 랜덤 문자열
		// TODO: { key: email, value: 인증코드 } redis에 저장 10분으로 expire time 설정
		// TODO: 해당 이메일로 인증코드 보내기
	}

	/**
	 * 유저 정보로 토큰 만들기
	 * @param userData
	 */
	async createUserToken(userData: UserData): Promise<string> {
		const { email, nickname, password, provider, snsId } = userData;

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// 유저 정보를 jwt로 암호화한 Token 만들기
		return jwt.sign(
			{ email, nickname, hashedPassword, provider, snsId },
			`${process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
			}
		);
	}

	/**
	 * 토큰을 복호화해서 얻은 이메일의 인증코드와 유저가 보낸 인증코드가 같은지 확인
	 * @param userToken
	 * @param verifyCode
	 */
	verifyEmail(userToken: string, code: string): VerifyResult {
		const { email } = jwt.verify(
			userToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as UserData;

		// TODO: redis에서 해당 이메일에 맞는 value값 찾기
		const redisVerifyCode = '';

		// TODO: 만료 판단 하기
		// return { verify:false, timeOut: true };

		if (code === redisVerifyCode) {
			return { verify: true, timeOut: false };
		}
		return { verify: false, timeOut: false };
	}

	/**
	 * 토큰을 복호화해서 얻은 이메일에 인증코드 재전송
	 * @param userToken
	 */
	async reSendEmail(userToken: string): Promise<void> {
		const { email } = jwt.verify(
			userToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as HashedUserData;

		// TODO: 해당 이메일에 대한 인증코드 만들기 8자리 랜덤 문자열

		// TODO: { key: email, value: 인증코드 } redis에 저장 10분으로 expire time 설정

		// TODO: 해당 이메일로 인증코드 보내기
		this.sendEmail(email);
	}

	/**
	 * 토큰을 복호화해서 얻은 유저정보로 새 유저 생성
	 * @param userToken
	 */
	async createLocalUser(userToken: string): Promise<Tokens> {
		// token 복호화
		const userData = jwt.verify(
			userToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as HashedUserData;

		// 토큰에 있는 정보로 유저 생성
		const { uuid } = await this.userService.createUser(userData);

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
