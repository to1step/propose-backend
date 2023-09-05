import { Model, model, Schema } from 'mongoose';

interface CourseTagDAO {
	tag: string;
	courses: string[];
}

type CourseTagDAOModel = Model<CourseTagDAO>;

const courseTagSchema = new Schema<CourseTagDAO, CourseTagDAOModel>(
	{
		tag: { type: String, required: true }, // 태그
		courses: { type: [String], required: true }, // 태그를 가지는 코스들
	},
	{
		timestamps: true,
	}
);

const CourseTagModel = model<CourseTagDAO, CourseTagDAOModel>(
	'CourseTag',
	courseTagSchema
);

export { CourseTagModel, CourseTagDAO };
