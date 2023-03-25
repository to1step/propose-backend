import express from 'express';
import { validate, validateOrReject } from 'class-validator';
import { UserLocalCreateDTO } from '../types/requestTypes';
import UserService from '../services/userService';
import { UserDTO } from '../types/responseTypes';

const router = express.Router();
const userService = UserService.getInstance();

router.post('/users', async (req, res, next) => {
	try {
		const userLocalCreateDTO = new UserLocalCreateDTO(req.body);

		await validateOrReject(userLocalCreateDTO);

		const user = await userService.createUser(
			userLocalCreateDTO.toServiceModel()
		);

		const userDTO = new UserDTO(user);

		res.json(userDTO);
	} catch (e) {
		next(e);
	}
});

export default router;
