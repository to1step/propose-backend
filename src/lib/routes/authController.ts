import express from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import UserDataDto from '../types/requestTypes/userData.dto';
import EmailVerificationDto from '../types/requestTypes/emailVerification.dto';
import EmailValidationDto from '../types/requestTypes/emaliValidation.dto';
import LocalSignInDto from '../types/requestTypes/localSignIn.dto';
import NicknameValidationDto from '../types/requestTypes/nicknameValidation.dto';

const router = express.Router();
const authService = AuthService.getInstance();

/**
 * @swagger
 * /auth/local/sign-in:
 *   post:
 *     tags:
 *       - AuthController
 *     summary: 로컬 로그인
 *     description: 로컬 로그인
 *     requestBody:
 *       description: LocalSignInDto
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LocalSignInDto"
 *     responses:
 *       '200':
 *         description: 로그인 성공
 *         header:
 *           Set-Cookie:
 *             description: 쿠기 값
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: 로그인 성공
 *                   example: true
 */
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

/**
 * @swagger
 * /auth/local/email-validation:
 *   post:
 *     tags:
 *       - AuthController
 *     summary: 이메일 중복체크
 *     description: 이메일 다른 유저가 사용중인지 확인
 *     requestBody:
 *       description: EmailValidationDto
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EmailValidationDto"
 *     responses:
 *       '200':
 *         description: 이메일 사용가능 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: 사용중이면 true / 사용중이 아니면 false 반환
 *                   example: true
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
 * @swagger
 * /auth/local/nickname-validation:
 *   post:
 *     tags:
 *       - AuthController
 *     summary: 닉네임 중복체크
 *     description: 닉네임 다른 유저가 사용중인지 확인
 *     produces:
 *     - application/json
 *     requestBody:
 *       description: NicknameValidationDto
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NicknameValidationDto"
 *     responses:
 *       '200':
 *         description: 닉네임 사용가능 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: 사용중이면 true / 사용중이 아니면 false 반환
 *                   example: true
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
 * @swagger
 * /auth/local/email-code:
 *   post:
 *     tags:
 *       - AuthController
 *     summary: 인증메일 전송
 *     description: 유저정보 redis에 저장, 인증메일 전송
 *     requestBody:
 *       description: UserDataDto
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserDataDto"
 *     responses:
 *       '200':
 *         description: 인증 메일 전송 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: 이메일 전송 성공
 *                   example: true
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
 * @swagger
 * /auth/local/email-verification:
 *   post:
 *     tags:
 *       - AuthController
 *     summary: 이메일 인증 및 유저 회원가입
 *     description: redis에 저장된 인증번호와 비교 후 일치 시 유저 회원가입
 *     headers:
 *       description: EmailVerificationDto
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EmailVerificationDto"
 *     responses:
 *       '200':
 *         description: 회원가입 성공 즉시 로그인
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: 회원가입 성공
 *                   example: true
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
router.get('/auth/kakao', (req, res, next) => {
	res.redirect(
		`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`
	);
});

router.get('/auth/kakao/redirect', async (req, res, next) => {
	try {
		const code = req.query.code as string;

		if (!code) {
			throw new Error('code not found');
		}

		const { accessToken, refreshToken } = await authService.kakaoLogin(code);

		res
			.cookie('accessToken', accessToken)
			.cookie('refreshToken', refreshToken)
			.redirect('http://localhost:4000');
	} catch (error) {
		next(error);
	}
});
//#endregion

export default router;
