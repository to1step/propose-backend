import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import TestService from '../services/testService';
import checkAccessToken from '../middlewares/checkAccessToken';

const testService = TestService.getInstance();
const router = Router();

const upload = multer({
	dest: path.join(__dirname, '..', '..', '..', 'images/'),
	limits: {
		fileSize: 3000000,
		files: 1,
	},
});
router.post(
	'/test/images',
	checkAccessToken,
	upload.array('images', 1),
	async (req: Request, res: Response, next: NextFunction) => {
		// 이미지 파일을 보내지 않았다면 빈 배열로 초기화
		const files = (req.files as Express.Multer.File[]) ?? [];
		const imageLocationList = await testService.uploadImages(files);

		res.json({
			data: {
				imageLocationList,
			},
		});
	}
);

export default router;
