import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import UserService from './userService';
import { KakaoTokenResponse, KakaoUserReponse } from '../types/type';

dotenv.config();

class AuthService {
	private static instance: AuthService;

	userService: UserService;

	private constructor() {
		this.userService = UserService.getInstance();
	}

	makeAccessToken(userUUID: string): string {
		try {
			return jwt.sign(
				{ userUUId: userUUID },
				`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
				{
					algorithm: 'RS256',
					expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
				}
			);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}

			throw new Error('Unexpected error');
		}
	}

	makeRefreshToken(userUUID: string): string {
		try {
			return jwt.sign(
				{ userUUId: userUUID },
				`${process.env.REFRESH_TOKEN_SECRET_KEY}`,
				{
					algorithm: 'RS256',
					expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
				}
			);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}

			throw new Error('Unexpected error');
		}
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
	// 		// TODO: 로직 분리 및 에러 처리 삭제 => 프론트랑 논의 후 결정
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
