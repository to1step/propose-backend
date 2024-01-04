enum ErrorCode {
	// 인증 관련 에러 코드
	INVALID_LOGIN = 1000, // 잘못된 로그인 방식 -> 소셜 아이디로 로컬로그인 하는경우
	WRONG_PASSWORD = 1001, // 비밀번호 틀림
	EMAIL_SEND_EXCEED = 1002, // 이메일 전송 5회 초과
	WRONG_VERIFY_CODE = 1003, // 인증메일 코드가 일치하지 않음
	KAKAO_LOGIN_ERROR = 1004, // 카카오 로그인 에러

	// 토큰 관련 에러 코드
	INVALID_ACCESS_TOKEN = 1100, // 변조된 access
	EXPIRED_ACCESS_TOKEN = 1101, // access 토큰 시간 만료
	INVALID_REFRESH_TOKEN = 1102, // 변조된 refresh 토큰
	EXPIRED_REFRESH_TOKEN = 1103, // refresh 토큰 시간 만료
	NO_ACCESS_TOKEN_IN_HEADER = 1104, // access 토큰이 헤더에 없는 경우
	NO_REFRESH_TOKEN_IN_HEADER = 1105, // refresh 토큰이 헤더에 없는 경우

	// 유저 관련 에러 코드
	USER_NOT_FOUND = 1200, // 존재하지 않는 유저

	// 가게 관련 에러 코드
	STORE_NOT_FOUND = 1300, // 가게 조회시 없는 가게
	NO_STORE_UUID_QUERY = 1301, // api query에 가게 uuid가 없는 경우
	NO_STORE_REVIEW_UUID_IN_QUERY = 1302, // api query에 가게 리뷰 uuid가 없는 경우
	DUPLICATE_STORE_LIKE_ERROR = 1303, // 좋아요를 눌렀는데 다시 누르는 경우
	STORE_LIKE_NOT_FOUND = 1304, // 좋아요를 누른 기록이 없는데 좋아요를 취소하는 경우
	STORE_REVIEW_NOT_FOUND = 1305, // 가게 리뷰 조회시 없는 리뷰
	STORE_IMAGE_NOT_FOUND = 1306, // 가게 리뷰 이미지 없음

	// 코스 관련 에러 코드
	COURSE_NOT_FOUND = 1400, // 코스 조회시 없는 코스
	DUPLICATE_COURSE_LIKE_ERROR = 1401, // 좋아요를 눌렀는데 다시 누르는 경우
	COURSE_LIKE_NOT_FOUND = 1402, // 좋아요를 누른 기록이 없는데 좋아요를 취소하는 경우
	COURSE_REVIEW_NOT_FOUND = 1403, // 코스 리뷰 조회시 없는 리뷰
	PRIVATE_COURSE = 1404, // 비공개인 코스를 가져오려 하는 경우

	// 태그 관련 에러 코드
	TAG_NOT_FOUND = 1500,

	// api 요청 에러
	INVALID_QUERY = 1600,

	// 기타 에러
	UNCATCHED_ERROR = 1700, // 예상 못한 에러
}

export default ErrorCode;
