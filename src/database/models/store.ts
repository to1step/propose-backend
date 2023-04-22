import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - uuid
 *         - name
 *         - coordinates
 *         - representImage
 *         - tags
 *         - startTime
 *         - endTime
 *       properties:
 *         uuid:
 *           type: string
 *           description: 가게 식별 uuid
 *         name:
 *           type: string
 *           description: 가게 상호
 *         coordinates:
 *           type: array
 *           description: 가게 좌표
 *           item:
 *             type: integer
 *         representImage:
 *           type: string
 *           description: 가게 이미지 주소
 *         tags:
 *           type: array
 *           description: 태그들
 *           items:
 *             type: string
 *             description: 태그
 *         startTime:
 *           type: string
 *           description: 가게 영업 시작 시간
 *         endTime:
 *           type: string
 *           description: 가게 영업 종료 시간
 */

interface StoreDAO {
	uuid: string;
	name: string;
	coordinates: number[];
	representImage?: string;
	tags?: string[];
	startTime?: string;
	endTime?: string;
}

type StoreDAOModel = Model<StoreDAO>;
const storeSchema = new Schema<StoreDAO, StoreDAOModel>(
	{
		uuid: { type: String, required: true }, // 가게 식별 uuid
		name: { type: String, required: true }, // 가게 이름
		coordinates: { type: [Number], required: true }, // 가게좌표
		representImage: { type: String }, // 가게 대표 사진 src
		tags: { type: [String] }, // 가게 태그 배열
		startTime: { type: Date }, // 가게 오픈 시간
		endTime: { type: Date }, // 가게 종료 시간
	},
	{
		timestamps: true,
	}
);

const Store = model<StoreDAO, StoreDAOModel>('Store', storeSchema);

export { Store };
