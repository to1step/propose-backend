import HttpError from './httpError';

export default class UnauthorizedError extends HttpError {
	constructor(errorCode: number, data: [string: string]) {
		super('UNAUTHORIZED', 401);
		this.errorCode = errorCode;
		this.data = data;
	}
}