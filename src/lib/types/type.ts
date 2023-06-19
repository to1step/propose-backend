import { StoreCategory, Transportation } from '../../database/types/enums';

/**
 * 서비스 단에서 사용되는 파일 타입들 정의
 */

// user
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
	provider: string;
	snsId: string | null;
	profileImage: string | null;
	commentAlarm: boolean;
	updateAlarm: boolean;
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

type ChangeProfileForm = {
	nickname: string;

	profileImage: string | null;

	commentAlarm: boolean;

	updateAlarm: boolean;
};

// store
type Store = {
	uuid: string;
	name: string;
	category: StoreCategory;
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
	category: StoreCategory;
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
	category: StoreCategory;
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
	category: StoreCategory;
	description: string;
	location: string;
	coordinates: number[];
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
};

type CreateStoreReviewForm = {
	review: string;
};

type UpdateStoreReviewForm = {
	review: string;
};

// course
type Course = {
	uuid: string;
	user: string;
	name: string;
	stores: string[];
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
};

type CourseEntireInfo = {
	uuid: string;
	user: string;
	name: string;
	stores: string[];
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
	courseReviews: CourseReview[];
	reviewCount: number;
	likeCount: number;
	iLike: boolean;
};

type Transport = {
	startStore: string;
	endStore: string;
	comment: string | null;
	transportation: Transportation | null;
};

type CreateTransportForm = {
	startStore: string;
	endStore: string;
	comment: string | null;
	transportation: Transportation | null;
};

type CreateCourseForm = {
	name: string;
	stores: string[];
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
};

type UpdateCourseForm = {
	name: string;
	stores: string[];
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
};

type CourseReview = {
	uuid: string;
	user: string;
	review: string;
};

type CreateCourseReviewForm = {
	review: string;
};

type UpdateCourseReviewForm = {
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
	ChangeProfileForm,
	Store,
	StoreEntireInfo,
	CreateStoreForm,
	UpdateStoreForm,
	CreateStoreReviewForm,
	UpdateStoreReviewForm,
	Course,
	CourseEntireInfo,
	Transport,
	CreateTransportForm,
	CreateCourseForm,
	UpdateCourseForm,
	CourseReview,
	CreateCourseReviewForm,
	UpdateCourseReviewForm,
};
