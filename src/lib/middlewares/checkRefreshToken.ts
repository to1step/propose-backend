import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from './errors';
import ErrorCode from '../types/customTypes/error';

const checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.header('refresh_token');

		if (!refreshToken) {
			throw new BadRequestError(ErrorCode.NO_REFRESH_TOKEN_IN_HEADER, [
				{ data: 'No token in header' },
			]);
		}

		const decoded = jwt.verify(
			refreshToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		);

		if (typeof decoded === 'string' || !decoded.userUUID) {
			throw new BadRequestError(ErrorCode.INVALID_REFRESH_TOKEN, [
				{ data: 'Invalid refresh token' },
			]);
		}

		req.userUUID = decoded.userUUID;
		next();
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') {
			throw new BadRequestError(ErrorCode.EXPIRED_REFRESH_TOKEN, [
				{ data: 'Expired token' },
			]);
		} else if (err.name === 'JsonWebTokenError') {
			throw new BadRequestError(ErrorCode.INVALID_REFRESH_TOKEN, [
				{ data: 'Invalid token' },
			]);
		} else if (err.name === 'NotBeforeError') {
			throw new BadRequestError(ErrorCode.INVALID_REFRESH_TOKEN, [
				{ data: 'Invalid token' },
			]);
		}

		throw err;
	}
};

export default checkRefreshToken;
