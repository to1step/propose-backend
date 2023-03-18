import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { User } from '../../database/models/user';

dotenv.config();
const router = express.Router();

router.post('/auth/local', async (req, res, next) => {
	// resource Owner가 로그인이 되어있지 않다면 loginPage로 이동시킨다.
	const loginPage = `http://localhost:3000/loginPage?client_id=${process.env.LOCAL_CLIENT_ID}&scope=a&redirect_uri=${process.env.LOCAL_REDIRECT_URI}`;
	// const url = `https://localhost:4000/resourceServer/oauth/authorize?response_type=code&client_id=${process.env.LOCAL_CLIENT_ID}&scope=a&redirect_uri=${process.env.LOCAL_REDIRECT_URI}`;
});

router.post('/redirect/local', async (req, res, next) => {
	const { code } = req.query;
	// 4. resourceServer에게 client_id와 client_secret 그리고 resource Owner에게 받은 인가코드를 주며 이 client의 인가 코드가 맞는지 확인함
	await axios({
		method: 'post',
		url: `http://localhost:4000/resourceServer/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&client_secret=a&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&code=${code}`,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	}).then(async (response) => {
		// 7. { key: userId, value: refreshToken } 형식으로 redis에 저장
		const { refreshToken } = response.data;

		// 7. resourceServer에게 받은 accessToken을 resource Owner에게 전달
		const { accessToken } = response.data;

		res.send({ accessToken });
	});
});

router.get('/login/kakao', async (req, res, next) => {
	res.redirect(
		`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URT}`
	);
});

router.get('/redirect/kakao', async (req, res, next) => {
	try {
		const response = await axios({
			method: 'post',
			url: `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URT}&code=${req.query.code}`,
			// query 나누기
			headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		});

		const userData = await axios({
			method: 'post',
			url: `https://kapi.kakao.com/v2/user/me`,
			headers: {
				Authorization: `Bearer ${response.data.access_token}`,
			},
		});

		// {
		// 	id: 2708456670,
		// 	connected_at: '2023-03-16T10:42:33Z',
		// 	properties: { nickname: '김민우' },
		// 	kakao_account: {
		// 	  profile_nickname_needs_agreement: false,
		// 	  profile: { nickname: '김민우' },
		// 	  has_email: true,
		// 	  email_needs_agreement: false,
		// 	  is_email_valid: true,
		// 	  is_email_verified: true,
		// 	  email: 'gkqkehs7@nate.com'
		// 	}
		//  }
		console.dir(userData.data);
		console.dir(userData.data.profile);

		// 2. 새 유저이면 db에 저장
		// 3. 토큰 발급

		// 1. 새 유저 인지 확인
		if (
			userData.data.kakao_account.is_email_verified &&
			userData.data.kakao_account.is_email_valid
		) {
			const user = await User.findOne({
				snsId: `${userData.data.id}`,
				provider: 'kakao',
			});

			if (user) {
				// [redis에 refreshToken저장코드]

				const accessToken = jwt.sign(
					{ userUUId: user.uuid },
					`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
					{
						algorithm: 'RS256',
						expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
					}
				);

				const refreshToken = jwt.sign(
					{ userUUId: user.uuid },
					`${process.env.REFRESH_TOKEN_SECRET_KEY}`,
					{
						algorithm: 'RS256',
						expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
					}
				);

				// [redis에 refreshToken저장코드]
				res
					.cookie('Authentication', accessToken, {
						expires: new Date(Date.now() + 900000),
						httpOnly: true,
					})
					.cookie('Refresh', refreshToken, {
						expires: new Date(Date.now() + 900000),
						httpOnly: true,
					})
					.redirect(301, `${process.env.FRONT_PORT}`);
			} else {
				const newUser = await new User({
					uuid: uuidv4(),
					email: userData.data.kakao_account.email,
					nickname: userData.data.kakao_account.email,
					provider: 'kakao',
					snsId: `${userData.data.id}`,
				}).save();

				const accessToken = jwt.sign(
					{ userUUId: newUser.uuid },
					`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
					{
						algorithm: 'RS256',
						expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
					}
				);

				const refreshToken = jwt.sign(
					{ userUUId: newUser.uuid },
					`${process.env.REFRESH_TOKEN_SECRET_KEY}`,
					{
						algorithm: 'RS256',
						expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
					}
				);

				// [redis에 refreshToken저장코드]
				res
					.cookie('Authentication', accessToken, {
						expires: new Date(Date.now() + 900000),
						httpOnly: true,
					})
					.cookie('Refresh', refreshToken, {
						expires: new Date(Date.now() + 900000),
						httpOnly: true,
					})
					.redirect(301, `${process.env.FRONT_PORT}`);
			}
		}
	} catch (error) {
		next(error);
	}
});

export { router };
