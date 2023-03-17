import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const authRouter = express.Router();

authRouter.post('/login/local', async (req, res, next) => {
	// resource Owner가 로그인이 되어있지 않다면 loginPage로 이동시킨다.
	const loginPage = `http://localhost:3000/loginPage?client_id=${process.env.LOCAL_CLIENT_ID}&scope=a&redirect_uri=${process.env.LOCAL_REDIRECT_URI}`;
	// const url = `https://localhost:4000/resourceServer/oauth/authorize?response_type=code&client_id=${process.env.LOCAL_CLIENT_ID}&scope=a&redirect_uri=${process.env.LOCAL_REDIRECT_URI}`;
});

authRouter.post('/redirect/local', async (req, res, next) => {
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

export { authRouter };
