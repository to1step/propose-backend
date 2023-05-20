import HttpError from './httpError';

export default class ForbiddenError extends HttpError {
	constructor(data: [string: string]) {
		super('FORBIDDEN', 403);
		this.data = data;
	}
}
