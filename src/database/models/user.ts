import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - uuid
 *         - email
 *         - nickname
 *         - snsId
 *       properties:
 *         uuid:
 *           type: string
 *           description: 유저 식별 Id
 *         email:
 *           type: string
 *           description: 유저 이메일
 *         password:
 *           type: string
 *           description: 유저 비밀번호
 *         nickname:
 *           type: string
 *           description: 유저 닉네임
 *         provider:
 *           type: string
 *           description: 회원가입 경로
 *         snsId:
 *           type: string
 *           description: 소셜 회원가입 유저의 소셜 Id
 */

interface UserDAO {
	uuid: string;
	email: string;
	password: string | null;
	nickname: string;
	provider: string;
	snsId: string | null;
}

type UserDAOModel = Model<UserDAO>;

const userSchema = new Schema<UserDAO, UserDAOModel>(
	{
		uuid: { type: String, required: true, unique: true }, // 유저 식별 uuid
		email: { type: String, required: true, unique: true }, // 유저 email
		password: { type: String },
		nickname: { type: String, required: true }, // 유저 nickname
		provider: { type: String, required: true }, // 소셜 로그인 종류 kakao/naver/google/local
		snsId: { type: String }, // 소셜 로그인 아이디
	},
	{
		timestamps: true,
	}
);

const UserModel = model<UserDAO, UserDAOModel>('User', userSchema);

export { UserModel, UserDAO };
