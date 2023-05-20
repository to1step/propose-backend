type ErrorCode = 400 | 401 | 403 | 404 | 500;
type ErrorMessage =
	| 'BAD_REQUEST'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'INTERNAL_SERVER_ERROR';

export default class HttpError extends Error {
	public code: ErrorCode;

	public data?: [string: string];

	constructor(message: ErrorMessage, code: ErrorCode) {
		super(message);
		this.code = code;
	}
}
