import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
	// httpOnly: true,
	sameSite: 'lax',
	secure: false,
	path: '/',
};
