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

type User = {
	uuid: string;
	email: string;
	password: string | null;
	nickname: string;
	snsId: string | null;
	provider: string;
};

type UserData = {
	email: string;
	password: string;
	nickname: string;
	provider: string;
	snsId: string | null;
};

type HashedUserData = {
	email: string;
	hashedPassword: string;
	nickname: string;
	provider: string;
	snsId: string | null;
};

type EmailValidationForm = {
	email: string;
};

type VerifyCode = {
	code: string;
};

type VerifyResult = {
	verify: boolean;
	timeOut: boolean;
};

type Tokens = {
	accessToken: string;
	refreshToken: string;
};

export type {
	KakaoTokenResponse,
	KakaoUserReponse,
	User,
	UserData,
	HashedUserData,
	EmailValidationForm,
	VerifyCode,
	VerifyResult,
	Tokens,
};
