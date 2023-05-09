import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const checkHeaderToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.header('accessToken');

		if (!accessToken) {
			throw new Error('no token in header');
		}

		const decoded = jwt.verify(
			accessToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		);

		if (typeof decoded === 'string' || !decoded.userUUID) {
			throw new Error('invalid user');
		}

		req.userUUID = decoded.userUUID;
		next();
	} catch (err: any) {
		//TODO: custom error 적용
		if (err.name === 'TokenExpiredError') {
			throw new Error(`${err.message}`);
		} else if (err.name === 'JsonWebTokenError') {
			throw new Error(`${err.message}`);
		} else if (err.name === 'NotBeforeError') {
			throw new Error(`${err.message}`);
		}

		throw err;
	}
};

export default checkHeaderToken;
