import { Router, Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import UserService from '../services/userService';
import checkAccessToken from '../middlewares/checkAccessToken';
import UpdateUserDto from '../types/requestTypes/UpdateUser.dto';
import UserDataDto from '../types/responseTypes/userData.dto';

const router = Router();
const userService = UserService.getInstance();

// 내 정보 가져오기
router.get(
	'/users/me',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const myProfile = await userService.getProfile(req.userUUID);

			const userData = new UserDataDto(myProfile);

			res.json({ data: userData });
		} catch (error) {
			next(error);
		}
	}
);

// 유저 정보 수정 수정
router.patch(
	'/users/me',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const updateUserDto = new UpdateUserDto(req.body);

			await validateOrReject(updateUserDto);

			await userService.changeProfile(
				updateUserDto.toServiceModel(),
				req.userUUID
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 회원탈퇴
router.delete(
	'/users/me',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await userService.deleteUser(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
