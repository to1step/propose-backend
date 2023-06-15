import express from 'express';
import { validateOrReject } from 'class-validator';
import UserService from '../services/userService';
import checkHeaderToken from '../middlewares/checkHeaderToken';
import ChangeNicknameDto from '../types/requestTypes/changeNickname.dto';
import ChangeProfileImageDto from '../types/requestTypes/changeProfileImage.dto';
import UserWithoutPasswordDto from '../types/responseTypes/userWithoutPassword.dto';

const router = express.Router();
const userService = UserService.getInstance();

// 내 정보 가져오기
router.get('/users/me', checkHeaderToken, async (req, res, next) => {
	try {
		const myProfile = await userService.getProfile(req.userUUID);

		const userWithoutPassword = new UserWithoutPasswordDto(myProfile);

		res.json({ data: userWithoutPassword });
	} catch (error) {
		next(error);
	}
});

// 닉네임 수정
router.patch('/users/nickname', checkHeaderToken, async (req, res, next) => {
	try {
		const changeNicknameDto = new ChangeNicknameDto(req.body);

		await validateOrReject(changeNicknameDto);

		await userService.changeNickname(
			changeNicknameDto.toServiceModel(),
			req.userUUID
		);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

// 프로필 이미지 수정
router.patch(
	'/users/profileImage',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			const changeProfileImageDto = new ChangeProfileImageDto(req.body);

			await validateOrReject(changeProfileImageDto);

			await userService.changeProfileImage(
				changeProfileImageDto.toServiceModel(),
				req.userUUID
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 프로필 이미지 삭제
router.delete(
	'/users/profileImage',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			await userService.deleteProfileImage(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 댓글 알림 수신 on
router.patch(
	'/users/commentAlarm/on',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			await userService.commentAlarmOn(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 댓글 알림 수신 off
router.patch(
	'/users/commentAlarm/off',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			await userService.commentAlarmOff(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 업데이트 알림 수신 on
router.patch(
	'/users/updateAlarm/on',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			await userService.updateAlarmOn(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 업데이트 알림 수신 off
router.patch(
	'/users/updateAlarm/off',
	checkHeaderToken,
	async (req, res, next) => {
		try {
			await userService.updateAlarmOff(req.userUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

// 회원탈퇴
router.delete('/users', checkHeaderToken, async (req, res, next) => {
	try {
		await userService.deleteUser(req.userUUID);

		res.json({ data: true });
	} catch (error) {
		next(error);
	}
});

export default router;
