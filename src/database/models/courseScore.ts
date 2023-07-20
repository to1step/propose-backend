import { Model, model, Schema } from 'mongoose';

interface CourseScoreDAO {
	course: string;
	date: string;
	score: number;
}

type CourseScoreDAOModel = Model<CourseScoreDAO>;

const courseScoreSchema = new Schema<CourseScoreDAO, CourseScoreDAOModel>(
	{
		course: { type: String, required: true }, // 코스 식별 uuid
		date: { type: String, required: true }, // 저장된 시각 millisecond
		score: { type: Number, required: true, default: 0 }, // 가게 점수
	},
	{
		timestamps: true,
	}
);
const CourseScoreModel = model<CourseScoreDAO, CourseScoreDAOModel>(
	'CourseScore',
	courseScoreSchema
);

export { CourseScoreModel, CourseScoreDAO };
