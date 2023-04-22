import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreLike:
 *       type: object
 *       required:
 *         - user
 *         - store
 *       properties:
 *         user:
 *           type: string
 *           description: 좋아요 누른 유저 식별 uuid
 *         store:
 *           type: string
 *           description: 유저가 좋아요 누른 가게 식별 uuid
 */

interface StoreLikeDAO {
	user: string;
	store: string;
}

type StoreLikeDAOModel = Model<StoreLikeDAO>;

const storeLikeSchema = new Schema<StoreLikeDAO, StoreLikeDAOModel>(
	{
		user: { type: String, required: true }, // 좋아요 누른 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
	},
	{
		timestamps: true,
	}
);

const StoreLike = model<StoreLikeDAO, StoreLikeDAOModel>(
	'StoreLike',
	storeLikeSchema
);

export { StoreLike };
