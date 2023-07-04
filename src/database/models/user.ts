import { Model, model, Schema } from 'mongoose';

interface UserDAO {
	uuid: string;
	email: string;
	password: string | null;
	nickname: string;
	provider: string;
	snsId: string | null;
	profileImage: string | null;
	commentAlarm: boolean;
	updateAlarm: boolean;
	deletedAt: Date | null;
}

type UserDAOModel = Model<UserDAO>;

const userSchema = new Schema<UserDAO, UserDAOModel>(
	{
		uuid: { type: String, required: true, unique: true }, // 유저 식별 uuid
		email: { type: String, required: true, unique: true }, // 유저 email
		password: { type: String }, // 비밀번호
		nickname: { type: String, required: true }, // 유저 nickname
		provider: { type: String, required: true }, // 소셜 로그인 종류 kakao/naver/google/local
		snsId: { type: String }, // 소셜 로그인 아이디
		profileImage: { type: String, default: null }, // 프로필 이미지
		commentAlarm: { type: Boolean, required: true, default: true }, // 댓글 알림 수신 여부
		updateAlarm: { type: Boolean, required: true, default: true }, // 업데이트 알림 수신 여부
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

const UserModel = model<UserDAO, UserDAOModel>('User', userSchema);

export { UserModel, UserDAO };
