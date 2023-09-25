import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import ImageService from '../services/imageService';
import checkAccessToken from '../middlewares/checkAccessToken';

const imageService = ImageService.getInstance();
const router = Router();

const upload = multer({
	dest: path.join(__dirname, '..', '..', '..', 'images/'),
	limits: {
		fileSize: 3000000,
		files: 1,
	},
});
router.post(
	'/images',
	upload.array('images', 1),
	async (req: Request, res: Response, next: NextFunction) => {
		// 이미지 파일을 보내지 않았다면 빈 배열로 초기화
		const files = (req.files as Express.Multer.File[]) ?? [];
		const imageLocationList = await imageService.uploadImages(files);

		res.json({
			data: {
				imageLocationList,
			},
		});
	}
);

export default router;
