import HttpError from './httpError';

export default class UnauthorizedError extends HttpError {
	constructor(data: [string: string]) {
		super('UNAUTHORIZED', 401);
		this.data = data;
	}
}
