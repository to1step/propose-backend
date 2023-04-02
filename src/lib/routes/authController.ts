import express from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
// #region request.dto
import EmailValidationFormDto from '../types/requestTypes/emaliValidationForm.dto';
import SignUpFormDto from '../types/requestTypes/signUpForm.dto';
import EmailVerificationFormDto from '../types/requestTypes/emailVerificationForm.dto';
// #region response.dto
import EmailValidationDto from '../types/responseTypes/emailValidation.dto';
import EmailVerificationDto from '../types/responseTypes/emailVerification.dto';
import EmailReVerificationDto from '../types/responseTypes/emailReVerification.dto';

const router = express.Router();
const authService = AuthService.getInstance();

router.post('/auth/local/email-validation', async (req, res, next) => {
	try {
		const emailValidationFormDto = new EmailValidationFormDto(req.body);

		await validateOrReject(emailValidationFormDto);

		// 이메일 중복 체크
		const emailValidation = await authService.validateEmail(
			emailValidationFormDto.toServiceModel()
		);

		const emailValidationDTO = new EmailValidationDto(emailValidation);

		res.json(emailValidationDTO);
	} catch (error) {
		next(error);
	}
});

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
			throw new Error('no header');
		}

		const emailVerificationFormDto = new EmailVerificationFormDto(req.body);

		await validateOrReject(emailVerificationFormDto);

		const emailVerification = await authService.verifyEmail(
			userToken,
			emailVerificationFormDto.toServiceModel()
		);

		const verifyResult = new EmailVerificationDto(emailVerification);
		res.json(verifyResult);
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

		const emailReVerificationDto = new EmailReVerificationDto();

		res.json(emailReVerificationDto);
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
		const { code } = req.query;

		if (!code) {
			throw new Error('Code not found');
		}

		// await authService.kakaoLogin(code as string);
	} catch (error) {
		next(error);
	}
});
//#endregion

export default router;
