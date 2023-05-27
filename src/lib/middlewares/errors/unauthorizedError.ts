import HttpError from './httpError';

export default class UnauthorizedError extends HttpError {
	constructor(errorCode: number, data: { [key: string]: any }[]) {
		super('UNAUTHORIZED', 401);
		this.errorCode = errorCode;
		this.data = data;
	}
}
