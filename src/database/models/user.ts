import { Model, model, Schema } from 'mongoose';

interface UserDAO {
	uuid: string;
	email: string;
	nickname: string;
	provider: string;
	snsId: string | null;
}

type UserDAOModel = Model<UserDAO>;

const userSchema = new Schema<UserDAO, UserDAOModel>(
	{
		uuid: { type: String, required: true }, // 유저 식별 uuid
		email: { type: String, required: true }, // 유저 email
		nickname: { type: String, requred: true }, // 유저 nickname
		provider: { type: String, required: true }, // 소셜 로그인 종류 kakao/naver/google/local
		snsId: { type: String }, // 소셜 로그인 아이디
	},
	{
		timestamps: true,
	}
);

const UserModel = model<UserDAO, UserDAOModel>('User', userSchema);

export { UserModel, UserDAO };
