import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from './errors';
import ErrorCode from '../types/customTypes/error';

const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.cookies.Authorization;

		if (!accessToken) {
			throw new BadRequestError(ErrorCode.NO_ACCESS_TOKEN_IN_HEADER, [
				{ data: 'No token in cookie' },
			]);
		}

		const decoded = jwt.verify(
			accessToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		);

		if (typeof decoded === 'string' || !decoded.userUUID) {
			throw new BadRequestError(ErrorCode.INVALID_ACCESS_TOKEN, [
				{ data: 'Invalid access token' },
			]);
		}

		req.userUUID = decoded.userUUID;
		next();
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') {
			throw new BadRequestError(ErrorCode.EXPIRED_ACCESS_TOKEN, [
				{ data: 'Expired token' },
			]);
		} else if (err.name === 'JsonWebTokenError') {
			throw new BadRequestError(ErrorCode.INVALID_ACCESS_TOKEN, [
				{ data: 'Invalid token' },
			]);
		} else if (err.name === 'NotBeforeError') {
			throw new BadRequestError(ErrorCode.INVALID_ACCESS_TOKEN, [
				{ data: 'Invalid token' },
			]);
		}

		throw err;
	}
};

export default checkAccessToken;
