import { Router, Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import SendMailDto from '../types/requestTypes/sendMail.dto';
import EmailVerificationDto from '../types/requestTypes/emailVerification.dto';
import EmailValidationDto from '../types/requestTypes/emaliValidation.dto';
import LocalSignInDto from '../types/requestTypes/localSignIn.dto';
import NicknameValidationDto from '../types/requestTypes/nicknameValidation.dto';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import { cookieOptions } from '../../utilies/cookieOptions';
import checkRefreshToken from '../middlewares/checkRefreshToken';

const router = Router();
const authService = AuthService.getInstance();

router.post(
	'/auth/local/sign-in',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const localSignInDto = new LocalSignInDto(req.body);

			await validateOrReject(localSignInDto);

			const { accessToken, refreshToken } = await authService.localSignIn(
				localSignInDto
			);

			res
				.cookie('Authorization', accessToken, cookieOptions)
				.cookie('refresh_token', refreshToken, cookieOptions)
				.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

//#region 로컬 회원가입
router.post(
	'/auth/local/email-validation',
	async (req: Request, res: Response, next: NextFunction) => {
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
	}
);

router.post(
	'/auth/local/nickname-validation',
	async (req: Request, res: Response, next: NextFunction) => {
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
	}
);

router.post(
	'/auth/local/email-code',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userIp = req.ip;

			const sendMailDto = new SendMailDto(req.body);

			await validateOrReject(sendMailDto);

			await authService.sendEmail(sendMailDto.toServiceModel(), userIp);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/auth/local/email-verification',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userIp = req.ip;

			const emailVerificationDto = new EmailVerificationDto(req.body);

			await validateOrReject(emailVerificationDto);

			const { accessToken, refreshToken } = await authService.verifyEmail(
				emailVerificationDto.toServiceModel(),
				userIp
			);

			res
				.cookie('Authorization', accessToken, cookieOptions)
				.cookie('refresh_token', refreshToken, cookieOptions)
				.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);
//#endregion

router.post(
	'/auth/refresh-token',
	checkRefreshToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const accessToken = authService.reissue(req.userUUID);

			res
				.cookie('Authorization', accessToken, cookieOptions)
				.json({ data: true });
		} catch (e) {
			next(e);
		}
	}
);

router.post(
	'/auth/sign-out',
	checkRefreshToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await authService.signOut(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

//#region 카카오 로그인
router.get('/auth/kakao', (req: Request, res: Response, next: NextFunction) => {
	res.redirect(
		`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`
	);
});

router.get(
	'/auth/kakao/redirect',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { code } = req.query;

			if (!code || !(typeof code === 'string')) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'No code in query' },
				]);
			}

			const { accessToken, refreshToken } = await authService.kakaoLogin(code);

			res
				.cookie('Authorization', accessToken, cookieOptions)
				.cookie('refresh_token', refreshToken, cookieOptions)
				.redirect('http://localhost:5173');
		} catch (error) {
			next(error);
		}
	}
);
//#endregion

export default router;
