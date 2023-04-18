import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserService from './userService';
import {
	LocalSignInForm,
	EmailValidationForm,
	EmailVerifyCode,
	Tokens,
	LocalUser,
} from '../types/type';
import { UserModel } from '../../database/models/user';

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

		// 비밀번호가 존재하지 않으면 로컬 유저가 아니므로 에러
		if (!userPassword) {
			throw new Error('invalid user');
		}

		// DB의 비밀번호와 유저가 보낸 비밀번호 비교
		const compare = await bcrypt.compare(password, userPassword);

		// 틀릴시 에러
		if (!compare) {
			throw new Error('wrong password');
		}

		// 성공시 토큰 발급
		return this.createTokens(userUUID);
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

		// TODO: 해당 이메일에 대한 인증코드 만들기 8자리 랜덤 문자열
		const verifyCode = Math.random()
			.toString(36)
			.substring(2, 10)
			.toUpperCase();

		// TODO: { key: email-[email]-userIp, value: email/password/nickname/verifyCode/count }
		const redisKey = `email-${email}-${userIp}`;

		// TODO: redis에 해당 키가 없다면 redis에 저장 10분 30초로 expire time 설정

		// TODO: 만약 있다면 count++ / count가 5라면 error

		// TODO: 해당 이메일로 인증코드 보내기 <-- (aws ses ?)
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
		const { email, code } = emailVerifyCode;

		// TODO: redis에서 해당 key에 맞는 value값 찾기
		const redisKey = `email-${email}-${userIp}`;
		const redisValue = '';

		// TODO: code와 redis의 code 같은지 확인

		// TODO: 다르면 error

		// 같을시에 DB에 저장
		const { uuid } = await this.userService.createUser({
			email: '',
			password: '',
			nickname: '',
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
