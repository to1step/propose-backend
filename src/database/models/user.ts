import { Model, model, Schema } from 'mongoose';

interface IUser {
	name: string;
	email: string;
	avatar?: string;
	test: string;
}

type IUserModel = Model<IUser>;

const userSchema = new Schema<IUser, IUserModel>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	avatar: String,
});

const User = model<IUser, IUserModel>('User', userSchema);

export { User };
