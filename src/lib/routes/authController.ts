import express from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import UserDataDto from '../types/requestTypes/userData.dto';
import EmailVerificationDto from '../types/requestTypes/emailVerification.dto';
import EmailValidationDto from '../types/requestTypes/emaliValidation.dto';
import NicknameValidationDto from '../types/requestTypes/nicknameValidation.dto';

const router = express.Router();
const authService = AuthService.getInstance();

//#region 로컬 회원가입

/**
 * 이메일 중복확인
 */
router.post('/auth/local/email-validation', async (req, res, next) => {
	try {
		const emailValidationDto = new EmailValidationDto(req.body);

		await validateOrReject(emailValidationDto);

		const emailValidation = await authService.validateEmail(
			emailValidationDto.toServiceModel()
		);

		res.json({ data: emailValidation });
	} catch (error) {
		next(error);
	}
});

/**
 * 닉네임 중복확인
 */
router.post('/auth/local/nickname-validation', async (req, res, next) => {
	try {
		const nicknameValidationDto = new NicknameValidationDto(req.body);

		await validateOrReject(nicknameValidationDto);

		const nicknameValidation = await authService.validateNickname(
			nicknameValidationDto.toServiceModel()
		);

		res.json({ data: nicknameValidation });
	} catch (error) {
		next(error);
	}
});

/**
 * 유저정보 redis에 저장, 인증메일 전송
 */
router.post('/auth/local/email-code', async (req, res, next) => {
	try {
		const userIp = req.ip;

		const userDataDto = new UserDataDto(req.body);

		await validateOrReject(userDataDto);

		await authService.sendEmail(userDataDto.toServiceModel(), userIp);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

/**
 * 이메일 인증 및 유저 회원가입
 */
router.post('/auth/local/email-verification', async (req, res, next) => {
	try {
		const userIp = req.ip;

		const emailVerificationDto = new EmailVerificationDto(req.body);

		await validateOrReject(emailVerificationDto);

		const { accessToken, refreshToken } = await authService.verifyEmail(
			emailVerificationDto.toServiceModel(),
			userIp
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
