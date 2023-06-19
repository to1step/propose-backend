import express from 'express';
import { validateOrReject } from 'class-validator';
import UserService from '../services/userService';
import checkHeaderToken from '../middlewares/checkHeaderToken';
import UpdateUserDto from '../types/requestTypes/UpdateUser.dto';
import GetUserDataDto from '../types/responseTypes/getUserData.dto';

const router = express.Router();
const userService = UserService.getInstance();

// 내 정보 가져오기
router.get('/users/me', checkHeaderToken, async (req, res, next) => {
	try {
		const myProfile = await userService.getProfile(req.userUUID);

		const userData = new GetUserDataDto(myProfile);

		res.json({ data: userData });
	} catch (error) {
		next(error);
	}
});

// 유저 정보 수정 수정
router.patch('/users/me', checkHeaderToken, async (req, res, next) => {
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
});

// 회원탈퇴
router.delete('/users/me', checkHeaderToken, async (req, res, next) => {
	try {
		await userService.deleteUser(req.userUUID);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

export default router;
