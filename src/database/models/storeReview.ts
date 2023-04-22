import { Model, model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreReview:
 *       type: object
 *       required:
 *         - user
 *         - store
 *         - comment
 *       properties:
 *         user:
 *           type: string
 *           description: 리뷰를 쓴 유저 식별 uuid
 *         store:
 *           type: string
 *           description: 유저가 리뷰를 쓴 가게 식별 uuid
 *         comment:
 *           type: string
 *           description: 리뷰 내용
 */

interface StoreReviewDAO {
	user: string;
	store: string;
	comment: string;
}

type StoreReviewDAOModel = Model<StoreReviewDAO>;

const storeReviewSchema = new Schema<StoreReviewDAO, StoreReviewDAOModel>(
	{
		user: { type: String, required: true }, // 작성한 유저 식별 uuid
		store: { type: String, required: true }, // 가게 식별 uuid
		comment: { type: String, required: true }, // 리뷰 내용
	},
	{
		timestamps: true,
	}
);

const StoreReview = model<StoreReviewDAO, StoreReviewDAOModel>(
	'StoreReview',
	storeReviewSchema
);

export { StoreReview };
