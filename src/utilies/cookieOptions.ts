import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
	// httpOnly: true,
	sameSite: 'none',
	secure: true,
	path: '/',
};
