/**
 * 서비스 단에서 사용되는 파일 타입들 정의
 */

type KakaoTokenResponse = {
	access_token?: string;
};

type KakaoUserReponse = {
	id: number;
	properties?: {
		nickname?: string;
	};
	kakao_account?: {
		is_email_valid?: boolean;
		is_email_verified?: boolean;
		email?: string;
	};
};

type EmailValidationForm = {
	email: string;
};

type EmailValidation = {
	exist: boolean;
};

type EmailVerificationForm = {
	userToken: string | undefined;
	verifyCode: string;
};

type EmailVerification = {
	verify: boolean;
	timeOut: boolean;
};

type ReVerifyEmailForm = {
	userToken: string | undefined;
};

type SignUpForm = {
	email: string;
	nickname: string;
	password: string;
	provider: 'local';
	snsId: null;
};

type UserTokenForm = {
	email: string;
	nickname: string;
	password: string;
	provider: 'local';
	snsId: null;
};

type UserToken = {
	userToken: string | undefined;
};

type UserLocalCreateForm = {
	userToken: string | undefined;
	verify: boolean;
};

type UserCreateForm = {
	email: string;
	password: string;
	nickname: string;
	provider: string;
	snsId: string | null;
};

type Tokens = {
	accessToken: string;
	refreshToken: string;
};

export type {
	UserCreateForm,
	KakaoTokenResponse,
	KakaoUserReponse,
	EmailValidationForm,
	EmailValidation,
	EmailVerificationForm,
	EmailVerification,
	ReVerifyEmailForm,
	SignUpForm,
	UserTokenForm,
	UserToken,
	UserLocalCreateForm,
	Tokens,
};
