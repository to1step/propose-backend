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
	nickname: string;
	provider: string;
	snsId: string | null;
};

type UserLocalCreate = {
	email: string;
	nickname: string;
	provider: string;
	snsId: string | null;
};

export type { User, KakaoTokenResponse, KakaoUserReponse, UserLocalCreate };
