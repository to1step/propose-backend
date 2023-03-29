import express from 'express';
import UserService from '../services/userService';

const router = express.Router();
const userService = UserService.getInstance();

export default router;
