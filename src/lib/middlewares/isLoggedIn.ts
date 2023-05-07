import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, TokenError } from '../types/type';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.header('accessToken');

		if (!accessToken) {
			throw new Error('no token in header');
		}

		const decoded = jwt.verify(
			accessToken,
			`${process.env.ACCESS_TOKEN_SECRET_KEY}`
		) as DecodedToken;

		req.uuid = decoded.userUUID;
		next();
	} catch (err) {
		const jsonWebTokenError = err as TokenError;

		throw new Error(`${jsonWebTokenError.message}`);
	}
};

export default isLoggedIn;
