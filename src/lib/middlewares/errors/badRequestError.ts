import HttpError from './httpError';

export default class BadRequestError extends HttpError {
	constructor(data: [string: string]) {
		super('BAD_REQUEST', 400);
		this.data = data;
	}
}
