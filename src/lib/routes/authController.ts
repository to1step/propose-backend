import express from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import SignUpFormDto from '../types/requestTypes/signUpForm.dto';
import EmailVerificationFormDto from '../types/requestTypes/emailVerificationForm.dto';
import EmailVerificationDto from '../types/responseTypes/emailVerification.dto';
import EmailValidationFormDto from '../types/requestTypes/emaliValidationForm.dto';

const router = express.Router();
const authService = AuthService.getInstance();

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
 * 유저에게 이메일 확인
 */
router.post('/auth/local/sign-up', async (req, res, next) => {
	try {
		const signUpFormDto = new SignUpFormDto(req.body);

		await validateOrReject(signUpFormDto);

		// 유저정보를 jwt로 암호화한 code 만들기
		const userToken = await authService.signUp(signUpFormDto.toServiceModel());

		// userToken을 헤더에 담아 email 인증화면으로 redirect
		res.header('userToken', userToken).redirect(`front`);
	} catch (error) {
		next(error);
	}
});

router.post('/auth/local/email-verification', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');

		if (!userToken) {
			throw new Error('user token required');
		}

		const emailVerificationFormDto = new EmailVerificationFormDto(req.body);

		await validateOrReject(emailVerificationFormDto);

		const emailVerification = await authService.verifyEmail(
			userToken,
			emailVerificationFormDto.toServiceModel()
		);

		const verifyResult = new EmailVerificationDto(emailVerification);

		res.json({ data: verifyResult });
	} catch (error) {
		next(error);
	}
});

router.post('/auth/local/email-re-verification', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');

		if (!userToken) {
			throw new Error('no header');
		}

		await authService.reVerifyEmail(userToken);

		res.json({
			data: true,
		});
	} catch (error) {
		next(error);
	}
});

router.post('/auth/local/user', async (req, res, next) => {
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
			.redirect(301, 'front');
	} catch (error) {
		next(error);
	}
});

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
