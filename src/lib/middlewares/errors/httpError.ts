type ErrorCode = 400 | 401 | 403 | 404 | 500;
type ErrorMessage =
	| 'BAD_REQUEST'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'INTERNAL_SERVER_ERROR';

export default class HttpError extends Error {
	public code: ErrorCode;

	public errorCode?: number;

	public data?: { [key: string]: any }[];

	constructor(message: ErrorMessage, code: ErrorCode) {
		super(message);
		this.code = code;
	}
}
