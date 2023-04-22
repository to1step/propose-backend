import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreImage:
 *       type: object
 *       required:
 *         - user
 *         - store
 *         - imageSrc
 *       properties:
 *         user:
 *           type: string
 *           description: 사진을 올린 유저 식별 uuid
 *         store:
 *           type: string
 *           description: 해당 사진 가게 식별 uuid
 *         imageSrc:
 *           type: string
 *           description: 이미지 주소
 */

interface StoreImageDAO {
	user: string;
	store: string;
	imageSrc: string;
}

type StoreImageDAOModel = Model<StoreImageDAO>;

const storeImageSchema = new Schema<StoreImageDAO, StoreImageDAOModel>(
	{
		user: { type: String, required: true },
		store: { type: String, required: true },
		imageSrc: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const StoreImage = model<StoreImageDAO, StoreImageDAOModel>(
	'StoreImage',
	storeImageSchema
);

export { StoreImage };
