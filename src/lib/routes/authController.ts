// import express from 'express';
// import axios from 'axios';
// import dotenv from 'dotenv';
// import { v4 as uuidv4 } from 'uuid';
// import jwt from 'jsonwebtoken';
// import AuthService from '../services/authService';
// import UserService from '../services/userService';
// import { KakaoTokenResponse, KakaoUserReponse } from '../models/model';

// dotenv.config();
// const router = express.Router();

// router.post('/auth/local', async (req, res, next) => {
// 	// resource Owner가 로그인이 되어있지 않다면 loginPage로 이동시킨다.
// 	const loginPage = `http://localhost:3000/loginPage?client_id=${process.env.LOCAL_CLIENT_ID}&scope=a&redirect_uri=${process.env.LOCAL_REDIRECT_URI}`;
// 	// const url = `https://localhost:4000/resourceServer/oauth/authorize?response_type=code&client_id=${process.env.LOCAL_CLIENT_ID}&scope=a&redirect_uri=${process.env.LOCAL_REDIRECT_URI}`;
// });

// router.post('/redirect/local', async (req, res, next) => {
// 	const { code } = req.query;
// 	// 4. resourceServer에게 client_id와 client_secret 그리고 resource Owner에게 받은 인가코드를 주며 이 client의 인가 코드가 맞는지 확인함
// 	await axios({
// 		method: 'post',
// 		url: `http://localhost:4000/resourceServer/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&client_secret=a&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&code=${code}`,
// 		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// 	}).then(async (response) => {
// 		// 7. { key: userId, value: refreshToken } 형식으로 redis에 저장
// 		const { refreshToken } = response.data;

// 		// 7. resourceServer에게 받은 accessToken을 resource Owner에게 전달
// 		const { accessToken } = response.data;

// 		res.send({ accessToken });
// 	});
// });

// router.get('/login/kakao', async (req, res, next) => {
// 	res.redirect(
// 		`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URT}`
// 	);
// });

// // Controller는 분기처리만 시키고 service에서 모든 작업을 수행하도록하기
// router.get('/redirect/kakao', async (req, res, next) => {
// 	try {
// 		const getToken = await axios<KakaoTokenResponse>({
// 			method: 'post',
// 			url: `https://kauth.kakao.com/oauth/token`,
// 			params: {
// 				grant_type: 'authorization_code',
// 				client_id: `${process.env.KAKAO_CLIENT_ID}`,
// 				redirect_uri: `${process.env.KAKAO_REDIRECT_URT}`,
// 				code: `${req.query.code}`,
// 			},
// 			headers: { 'Content-type': 'application/x-www-form-urlencoded' },
// 		});

// 		if (!getToken?.data?.access_token) {
// 			throw new Error('axios error');
// 		}

// 		const userData = await axios<KakaoUserReponse>({
// 			method: 'post',
// 			url: `https://kapi.kakao.com/v2/user/me`,
// 			headers: {
// 				Authorization: `Bearer ${getToken.data.access_token}`,
// 			},
// 		});

// 		if (
// 			!userData?.data?.kakao_account?.email ||
// 			!userData?.data?.kakao_account?.is_email_valid ||
// 			!userData?.data?.kakao_account?.is_email_verified ||
// 			!userData?.data?.properties?.nickname
// 		) {
// 			throw new Error('axios error');
// 		}

// 		const user = await UserService.User(`${userData.data.id}`, 'kakao');

// 		// 새 유저인 경우
// 		if (!user) {
// 			if (
// 				userData?.data?.kakao_account?.is_email_verified &&
// 				userData?.data?.kakao_account?.is_email_valid
// 			) {
// 				const newUser = await UserService.createUser(
// 					userData.data.kakao_account.email,
// 					userData.data.properties.nickname,
// 					'kakao',
// 					`${userData.data.id}`
// 				);

// 				// accessToken, refreshToken발급
// 				const accessToken = AuthService.makeAccessToken(newUser.uuid);
// 				const refreshToken = AuthService.makeRefreshToken(newUser.uuid);

// 				// [redis에 refreshToken저장코드]

// 				// front cookie에 token저장
// 				return res
// 					.cookie('AccessToken', accessToken, {
// 						expires: new Date(Date.now() + 900000),
// 						httpOnly: true,
// 					})
// 					.cookie('RefreshToken', refreshToken, {
// 						expires: new Date(Date.now() + 900000),
// 						httpOnly: true,
// 					})
// 					.redirect(301, `${process.env.FRONT_PORT}`);

// 				// res에서 return을 꼭 해주어야하는가
// 			}

// 			return res.json({
// 				test: 'test',
// 			});
// 		}

// 		// accessToken, refreshToken발급
// 		const accessToken = AuthService.makeAccessToken(user.uuid);
// 		const refreshToken = AuthService.makeRefreshToken(user.uuid);

// 		// [redis에 refreshToken저장코드]

// 		// front cookie에 token저장
// 		return res
// 			.cookie('AccessToken', accessToken, {
// 				expires: new Date(Date.now() + 900000),
// 				httpOnly: true,
// 			})
// 			.cookie('RefreshToken', refreshToken, {
// 				expires: new Date(Date.now() + 900000),
// 				httpOnly: true,
// 			})
// 			.redirect(301, `${process.env.FRONT_PORT}`);
// 	} catch (error) {
// 		next(error);
// 	}
// });

// export { router };
