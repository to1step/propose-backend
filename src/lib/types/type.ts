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
		profile?: {
			nickname?: string;
		};
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

type UserCreateKey = 'local' | 'kakao' | 'google';

type UserCreateForm<T extends UserCreateKey> = T extends 'local'
	? LocalUser
	: SocialUser;

type LocalUser = {
	email: string;
	password: string | null;
	nickname: string;
	provider: 'local';
	// 로컬 로그인인 경우 password null
	snsId: null;
};

type SocialUser = {
	email: string;
	// 소셜 로그인인 경우 password null
	password: null;
	nickname: string;
	provider: 'naver' | 'kakao';
	snsId: string;
};

type SendMailForm = {
	email: string;
	password: string;
	nickname: string;
};

type LocalSignInForm = {
	email: string;
	password: string;
};

type EmailValidationForm = {
	email: string;
};

type NicknameValidationForm = {
	nickname: string;
};

type EmailVerifyCode = {
	email: string;
	code: string;
};

type Tokens = {
	accessToken: string;
	refreshToken: string;
};

// store
type Store = {
	uuid: string;
	name: string;
	description: string;
	location: string;
	coordinates: number[];
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
};

export type StoreReview = {
	uuid: string;
	user: string;
	review: string;
};

type StoreEntireInfo = {
	uuid: string;
	name: string;
	description: string;
	location: string;
	coordinates: number[];
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
	storeReviews: StoreReview[];
	reviewCount: number;
	likeCount: number;
	iLike: boolean;
};

type CreateStoreForm = {
	name: string;
	description: string;
	location: string;
	coordinates: number[];
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
};

type UpdateStoreForm = {
	name: string;
	description: string;
	location: string;
	coordinates: number[];
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
};

type LikeStoreForm = {
	storeUUID: string;
};

type UnlikeStoreForm = {
	storeUUID: string;
};

type CreateStoreReviewForm = {
	review: string;
};

type UpdateStoreReviewForm = {
	review: string;
};

export type {
	KakaoTokenResponse,
	KakaoUserReponse,
	User,
	LocalUser,
	UserCreateKey,
	UserCreateForm,
	LocalSignInForm,
	SendMailForm,
	EmailValidationForm,
	NicknameValidationForm,
	EmailVerifyCode,
	Tokens,
	Store,
	StoreEntireInfo,
	CreateStoreForm,
	UpdateStoreForm,
	LikeStoreForm,
	UnlikeStoreForm,
	CreateStoreReviewForm,
	UpdateStoreReviewForm,
};
