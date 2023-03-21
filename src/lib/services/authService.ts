// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';

// dotenv.config();

// class AuthService {
// 	private static instance: AuthService;

// 	private constructor() {}

// 	static makeAccessToken(userUUID: string): string {
// 		try {
// 			return jwt.sign(
// 				{ userUUId: userUUID },
// 				`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
// 				{
// 					algorithm: 'RS256',
// 					expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
// 				}
// 			);
// 		} catch (error) {
// 			if (error instanceof Error) {
// 				throw new Error(error.message);
// 			}

// 			throw new Error('Unexpected error');
// 		}
// 	}

// 	static makeRefreshToken(userUUID: string): string {
// 		try {
// 			return jwt.sign(
// 				{ userUUId: userUUID },
// 				`${process.env.REFRESH_TOKEN_SECRET_KEY}`,
// 				{
// 					algorithm: 'RS256',
// 					expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
// 				}
// 			);
// 		} catch (error) {
// 			if (error instanceof Error) {
// 				throw new Error(error.message);
// 			}

// 			throw new Error('Unexpected error');
// 		}
// 	}

// 	public static getInstance(): AuthService {
// 		if (!AuthService.instance) {
// 			AuthService.instance = new AuthService();
// 		}
// 		return AuthService.instance;
// 	}
// }

// export default AuthService;
