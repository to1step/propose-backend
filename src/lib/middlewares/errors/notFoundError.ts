import HttpError from './httpError';

export default class NotFoundError extends HttpError {
	constructor() {
		super('NOT_FOUND', 404);
	}
}
