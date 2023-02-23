/**
 * 서비스 단에서 사용되는 파일 타입들 정의
 */

// request                              service layer                 DBlayer
Request <------------------------------> Service <----------------------> DB
Router단에서 사용되는 타입들                T                               DB
  =
웹 프론트에서 받는 타입

class RequestUser {
  uuid: string | number;
  createdAt: number; //millisecond
}

uuid가 string 이면 -> 에러를 던지고
number인 경우에만 받아야해요.

class TUser {
  uuid: number;
  createdAt: number; //millisecond
}

class DBUser {
  uuid: string // "1234523512"
  createdAt: Date
}