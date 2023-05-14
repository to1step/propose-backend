import express from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import UserDataDto from '../types/requestTypes/userData.dto';
import EmailVerificationDto from '../types/requestTypes/emailVerification.dto';
import EmailValidationDto from '../types/requestTypes/emaliValidation.dto';
import LocalSignInDto from '../types/requestTypes/localSignIn.dto';
import NicknameValidationDto from '../types/requestTypes/nicknameValidation.dto';
import RefreshTokenDto from '../types/requestTypes/refreshToken.dto';

const router = express.Router();
const authService = AuthService.getInstance();

router.post('/auth/local/sign-in', async (req, res, next) => {
	try {
		const localSignInDto = new LocalSignInDto(req.body);

		await validateOrReject(localSignInDto);

		const { accessToken, refreshToken } = await authService.localSignIn(
			localSignInDto
		);

		res
			.cookie('accessToken', accessToken)
			.cookie('refreshToken', refreshToken)
			.json({ data: true });
	} catch (error) {
		next(error);
	}
});

//#region 로컬 회원가입
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

router.post('/auth/refresh-token', async (req, res, next) => {
	try {
		// TODO 얘 되는지 확인
		const refreshTokenDto = new RefreshTokenDto(req.body);

		await validateOrReject(refreshTokenDto);

		const accessToken = authService.reissue(refreshTokenDto.refresh_token);

		res.cookie('accessToken', accessToken).json({ data: true });
	} catch (e) {
		next(e);
	}
});

router.post('/auth/sign-out', async (req, res, next) => {
	try {
		const refreshToken = req.header('refreshToken');

		if (!refreshToken) {
			throw new Error('no token in header');
		}

		await authService.signOut(`${refreshToken}`);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

//#region 카카오 로그인
router.get('/auth/kakao', (req, res, next) => {
	res.redirect(
		`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`
	);
});

router.get('/auth/kakao/redirect', async (req, res, next) => {
	try {
		const { code } = req.query;

		if (!code || !(typeof code === 'string')) {
			throw new Error('code not found');
		}

		const { accessToken, refreshToken } = await authService.kakaoLogin(code);

		res
			.cookie('accessToken', accessToken)
			.cookie('refreshToken', refreshToken)
			// TODO: 프론트 redirect 코드
			.redirect('http://localhost:3000');
	} catch (error) {
		next(error);
	}
});
//#endregion

export default router;
