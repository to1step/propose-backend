enum ErrorCode {
	// 인증 관련 에러 코드
	LOCAL_INVALID_LOGIN = 1000, // sns이메일로 로컬 로그인을 하려할때 발생하는 에러
	LOCAL_WRONG_PASSWORD = 1001, // 로컬 로그인시 패스워드 오류
	KAKAO_CODE_NOT_FOUND = 1002, // 카카오 로그인 시, 인가 코드가 없는 경우
	KAKAO_TOKEN_NOT_FOUND = 1003, // 카카오 로그인 시, 인증 토큰이 없는 경우
	KAKAO_USER_DATA_NOT_FOUND = 1004, // 카카오 로그인 시, 유저 정보가 없는 경우
	EMAIL_SEND_COUNT_EXCEED = 1005, // 인증 메일 전송 횟수 5회 초과

	INVALID_TOKEN = 1006, // 토큰 검증시, userUUID가 들어있지 않은 경우
	INVALID_EMAIL_CODE = 1007, // 인증메일의 코드와 저장된 코드 불일치
	EXPIRED_REFRESH_TOKEN = 1008, // refresh 토큰 시간 만료
	INVALID_REFRESH_TOKEN = 1009, // 변조된 refresh 토큰
	NOT_STARTED_REFRESH_TOKEN = 1010, // 시작되지 않은 refresh 토큰
	EXPIRED_ACCESS_TOKEN = 1011, // access 토큰 시간 만료
	INVALID_ACCESS_TOKEN = 1012, // 변조된 access 토큰
	NOT_STARTED_ACCESS_TOKEN = 1013, // 시작되지 않은 access 토큰
	NO_ACCESS_TOKEN_IN_HEADER = 1014, // access 토큰이 헤더에 없는 경우
	NO_REFRESH_TOKEN_IN_HEADER = 1015, // refresh 토큰이 헤더에 없는 경우

	// 유저 관련 에러 코드
	USER_NOT_FOUND = 900, // 유저 조희시 없는 유저

	// 가게 관련 에러 코드
	STORE_NOT_FOUND = 800, // 가게 조회시 없는 가게

	// 코스 관련 에러 코드
	COURSE_NOT_FOUND = 700, // 코스 조회시 없는 코스

	// 기타 에러
	UNCATCHED_ERROR = 500, // 예상 못한 에러
}

export default ErrorCode;