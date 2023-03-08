import { Model, model, Schema } from 'mongoose';

enum ITransportation {
	BUS = 'BUS',
	WALK = 'WALK',
	SUBWAY = 'SUBWAY',
}

interface ICourse {
	uuid: string;
	name: string;
	shortComment: string;
	longComment?: string;
	private: boolean;
	storesUUID: string[];
	transport: {
		startStoreUUID: string;
		endStoreUUID: string;
		comment: string;
		transportation?: ITransportation;
	}[];
	tags: string[];
	userUUID: string;
}

type ICourseModel = Model<ICourse>;

const courseSchema = new Schema<ICourse, ICourseModel>({
	uuid: { type: String, required: true },
	name: { type: String, required: true },
	shortComment: { type: String, required: true },
	longComment: { type: String },
	private: { type: Boolean, required: true },
	transport: {
		type: [
			{
				startStoreUUID: { type: String, required: true },
				endStoreUUID: { type: String, required: true },
				comment: { type: String, required: true },
				transportation: { type: ITransportation },
			},
		],
		required: true,
	},
	storesUUID: { type: [String], required: true },
	tags: { type: [String], required: true },
	userUUID: { type: String, required: true },
});

const Course = model<ICourse, ICourseModel>('Course', courseSchema);

export { Course };
