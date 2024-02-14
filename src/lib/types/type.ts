import { StoreCategory, Transportation } from '../../database/types/enums';

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
	shortLocation?: string;
	representImage: string | null;
	tags: string[];
	startTime: string | null;
	endTime: string | null;
};

type StoreWithUser = {
	store: Store;
	user: User;
};

export type StoreReview = {
	uuid: string;
	user: string;
	review: string;
};

export type StoreReviewWithUser = {
	uuid: string;
	user: string;
	review: string;
	myReview: boolean;
	nickname: string;
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
	storeReviews: StoreReviewWithUser[];
	storeReviewImages: StoreImage[];
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

type StoreImage = {
	uuid: string;
	user: string;
	store: string;
	imageSrc: string;
};

type CreateStoreReviewImageForm = {
	src: string;
};

// course
type Course = {
	uuid: string;
	user: string;
	userName: string;
	name: string;
	stores: string[];
	representImage: string | null;
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
};

type CourseEntireInfo = {
	uuid: string;
	user: string;
	userName: string;
	name: string;
	stores: string[];
	representImage: string | null;
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
	storeNames: { [key: string]: string };
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
	representImage: string | null;
	shortComment: string;
	longComment: string | null;
	isPrivate: boolean;
	transports: Transport[];
	tags: string[];
};

type UpdateCourseForm = {
	name: string;
	stores: string[];
	representImage: string | null;
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
	StoreWithUser,
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
	CreateStoreReviewImageForm,
	StoreImage,
};
