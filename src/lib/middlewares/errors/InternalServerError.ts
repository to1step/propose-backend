import HttpError from './httpError';

export default class InternalServerError extends HttpError {
	constructor(errorCode: number, data: { [key: string]: any }[]) {
		super('INTERNAL_SERVER_ERROR', 500);
		this.errorCode = errorCode;
		this.data = data;
	}
}
