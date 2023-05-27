import HttpError from './httpError';

export default class ForbiddenError extends HttpError {
	constructor(errorCode: number, data: { [key: string]: any }[]) {
		super('FORBIDDEN', 403);
		this.errorCode = errorCode;
		this.data = data;
	}
}
