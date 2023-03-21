// import { v4 as uuidv4 } from 'uuid';
// import dotenv from 'dotenv';
// import { UserModel } from '../../database/models/user';
// import { User } from '../models/model';

// dotenv.config();

// class UserService {
// 	private static instance: UserService;

// 	private constructor() {}

// 	public static getInstance(): UserService {
// 		if (!UserService.instance) {
// 			UserService.instance = new UserService();
// 		}
// 		return UserService.instance;
// 	}

// 	// 구조 분해 할당 방식으로 parameter 받기
// 	static async createUser(
// 		email: string,
// 		nickname: string,
// 		provider: string,
// 		snsId: string
// 	): Promise<User> {
// 		try {
// 			const newUser = await new UserModel({
// 				uuid: uuidv4(),
// 				email: email,
// 				nickname: nickname,
// 				provider: provider,
// 				snsId: snsId,
// 			}).save();

// 			return {
// 				uuid: newUser.uuid,
// 				email: newUser.email,
// 				nickname: newUser.email,
// 				provider: newUser.provider,
// 				snsId: newUser.snsId,
// 			};
// 		} catch (error) {
// 			if (error instanceof Error) {
// 				throw new Error(error.message);
// 			}

// 			throw new Error('Unexpected error');
// 		}
// 	}

// 	static async findUser(snsId: string, provider: string): Promise<User | n> {
// 		try {
// 			const user = await UserModel.findOne({
// 				snsId: snsId,
// 				provider: provider,
// 			});

// 			if (!user) return null;
// 			return {
// 				uuid: user.uuid,
// 				email: user.email,
// 				nickname: user.email,
// 				provider: user.provider,
// 				snsId: user.snsId,
// 			};
// 		} catch (error) {
// 			if (error instanceof Error) {
// 				throw new Error(error.message);
// 			}

// 			throw new Error('Unexpected error');
// 		}
// 	}
// }

// export default UserService;
