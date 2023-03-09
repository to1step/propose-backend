import { Model, model, Schema } from 'mongoose';

interface IUser {
	uuid: string;
	email: string;
	nickname: string;
	provider: string;
	snsId: string;
}

type IUserModel = Model<IUser>;

const userSchema = new Schema<IUser, IUserModel>({
	uuid: { type: String, required: true }, // 유저 식별 uuid
	email: { type: String, required: true }, // 유저 email
	nickname: { type: String, requred: true }, // 유저 nickname
	provider: { type: String, required: true }, // 소셜 로그인 종류 kakao/naver/google/local
	snsId: { type: String, required: true }, // 소셜 로그인 아이디
});

const User = model<IUser, IUserModel>('User', userSchema);

export { User };
