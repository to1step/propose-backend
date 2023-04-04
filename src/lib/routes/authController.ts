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
router.post('/auth/local/email-code', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');

		let token = '';
		if (userToken) {
			token = await authService.reIssueToken(userToken);
		} else {
			const userDataDto = new UserDataDto(req.body);

			await validateOrReject(userDataDto);

			token = await authService.issueToken(userDataDto.toServiceModel());
		}

		if (token === '') {
			throw new Error('token Exception error');
		}

		res.header('userToken', token);
		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

/**
 * 이메일 인증
 */
router.get('/auth/local/email-verification', async (req, res, next) => {
	try {
		const userToken = req.header('userToken');
		const code = req.query.code as string;
		if (!userToken) {
			throw new Error('user token required');
		}
		if (!code) {
			throw new Error('email code required in query');
		}

		const emailVerification = await authService.verifyEmail(userToken, code);

		const verifyResult = new EmailVerificationDto(emailVerification);

		res.json({ data: verifyResult });
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

		res
			.cookie('accessToken', accessToken)
			.cookie('refreshToken', refreshToken)
			.json({ data: true });
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
