import express from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import UserDataDto from '../types/requestTypes/userData.dto';
import VerifyCodeDto from '../types/requestTypes/verifyCode.dto';
import EmailVerificationDto from '../types/responseTypes/emailVerification.dto';
import EmailValidationFormDto from '../types/requestTypes/emaliValidationForm.dto';

const router = express.Router();
const authService = AuthService.getInstance();

//#region 로컬 회원가입
/**
 * 이메일 중복확인
 */
router.post('/auth/local/email-validation', async (req, res, next) => {
	try {
		const emailValidationFormDto = new EmailValidationFormDto(req.body);

		await validateOrReject(emailValidationFormDto);

		// 이메일 중복 체크
		const emailValidation = await authService.validateEmail(
			emailValidationFormDto.toServiceModel()
		);

		res.json({ data: emailValidation });
	} catch (error) {
		next(error);
	}
});

/**
 * 유저정보 토큰으로 암호화, 인증메일 전송
 */
router.post('/auth/local/user-to-token', async (req, res, next) => {
	try {
		const userDataDto = new UserDataDto(req.body);

		await validateOrReject(userDataDto);

		// 유저정보를 jwt로 암호화한 code 만들기
		const userToken = await authService.userToToken(
			userDataDto.toServiceModel()
		);

		// userToken을 헤더에 담아 email 인증화면으로 redirect
		res.header('userToken', userToken).redirect(`${process.env.FRONT_PORT}`);
	} catch (error) {
		next(error);
	}
});

/**
 * 이메일 인증
 */
router.post('/auth/local/email-verification', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');

		if (!userToken) {
			throw new Error('user token required');
		}

		const verifyCodeDto = new VerifyCodeDto(req.body);

		await validateOrReject(verifyCodeDto);

		const emailVerification = await authService.verifyEmail(
			userToken,
			verifyCodeDto.toServiceModel()
		);

		const verifyResult = new EmailVerificationDto(emailVerification);

		res.json({ data: verifyResult });
	} catch (error) {
		next(error);
	}
});

/**
 * 인증메일 재전송
 */
router.post('/auth/local/re-send-email', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');

		if (!userToken) {
			throw new Error('no header');
		}

		await authService.reSendEmail(userToken);

		res.json({
			data: true,
		});
	} catch (error) {
		next(error);
	}
});

/**
 * 유저 회원가입
 */
router.post('/auth/local/sign-up', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');

		if (!userToken) {
			throw new Error('no header');
		}

		const { verify } = req.body;
		if (!verify) {
			throw new Error('invalid access');
		}

		const { accessToken, refreshToken } = await authService.createLocalUser(
			userToken
		);

		// 쿠키를 헤더에 담아 front로 redirect
		res
			.cookie('accessToken', accessToken)
			.cookie('refreshToken', refreshToken)
			.redirect(301, `${process.env.FRONT_PORT}`);
	} catch (error) {
		next(error);
	}
});
//#endregion

//#region 카카오 로그인
router.get('/auth/kakao', async (req, res, next) => {
	res.redirect(
		`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URT}`
	);
});

router.get('/auth/kakao/redirect', async (req, res, next) => {
	try {
		const code = req.query.code as string;

		if (!code) {
			throw new Error('Code not found');
		}

		// await authService.kakaoLogin(code);
	} catch (error) {
		next(error);
	}
});
//#endregion

export default router;
