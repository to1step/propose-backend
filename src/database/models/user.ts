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
	uuid: { type: String, required: true },
	email: { type: String, required: true },
	nickname: { type: String, requred: true },
	provider: { type: String, required: true },
	snsId: { type: String, required: true },
});

const User = model<IUser, IUserModel>('User', userSchema);

export { User };
