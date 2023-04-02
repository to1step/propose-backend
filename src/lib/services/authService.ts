import jwt from 'jsonwebtoken';
import UserService from './userService';
import {
	SignUpForm,
	UserTokenForm,
	EmailValidationForm,
	EmailVerification,
	EmailVerificationForm,
	Tokens,
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

		// fineOne method보다 성능 향상
		const existEmail = await UserModel.exists({ email }).exec();

		return !!existEmail;
	}

	async signUp(signUpForm: SignUpForm): Promise<string> {
		const { email, nickname, password, provider, snsId } = signUpForm;
		try {
			this.sendEmail(email);
		} catch (e) {
			// 할 작업 없음.
		}

		const userToken: SignUpForm = {
			email,
			nickname,
			password,
			provider,
			snsId,
		};

		// 해당 정보로 userToken 만들기
		return this.createUserToken(userToken);
	}

	async sendEmail(email: string): Promise<void> {
		// TODO: 해당 이메일에 대한 인증코드 만들기 8자리 랜덤 문자열
		// TODO: { key: email, value: 인증코드 } redis에 저장 10분으로 expire time 설정
		// TODO: 해당 이메일로 인증코드 보내기
	}

	createUserToken(userTokenForm: UserTokenForm): string {
		const { email, nickname, password, provider, snsId } = userTokenForm;

		// TODO: 패스워드 암호화 후 프론트로 보내기

		// 유저 정보를 jwt로 암호화한 Token 만들기
		return jwt.sign(
			{ email, nickname, password, provider, snsId },
			`${process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY}`,
			{
				algorithm: 'HS256',
			}
		);
	}

	verifyEmail(
		userToken: string,
		emailVerificationForm: EmailVerificationForm
	): EmailVerification {
		// TODO: token에서 이메일 추출
		const { email } = jwt.verify(
			userToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as UserTokenForm;

		// TODO: redis에서 해당 이메일에 맞는 value값 찾기
		const redisVerifyCode = '';

		// TODO: 만료 판단 하기
		// return { verify:false, timeOut: true };

		const { verifyCode } = emailVerificationForm;
		if (verifyCode === redisVerifyCode) {
			return { verify: true, timeOut: false };
		}
		return { verify: false, timeOut: false };
	}

	async reVerifyEmail(userToken: string): Promise<void> {
		const { email } = jwt.verify(
			userToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as UserTokenForm;

		// TODO: 해당 이메일에 대한 인증코드 만들기 8자리 랜덤 문자열

		// TODO: { key: email, value: 인증코드 } redis에 저장 10분으로 expire time 설정

		// TODO: 해당 이메일로 인증코드 보내기
		await this.sendEmail(email);
	}

	async createLocalUser(userToken: string): Promise<Tokens> {
		// token decode
		const decode = jwt.verify(
			userToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as UserTokenForm;

		// 토큰에 있는 정보로 유저 생성
		const { uuid } = await this.userService.createUser(decode);
		return this.createTokens(uuid);
	}

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
