import HttpError from './httpError';

export default class InternalServerError extends HttpError {
	constructor(data: [string: string]) {
		super('INTERNAL_SERVER_ERROR', 500);
		this.data = data;
	}
}
