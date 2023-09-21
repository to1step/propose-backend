import { Config } from '@jest/types';

const config: Config.InitialOptions = {
	preset: 'ts-jest', // 이 부분에서 ts-jest를 사용한다고 알려준다
	testEnvironment: 'node', //테스트 환경 'node' 환경을 사용한다 알려줌
	testMatch: ['**/test/*.test.(ts|tsx)'],
	// setupFiles: ['./test/setupDatabase.ts'],
};

export default config;
