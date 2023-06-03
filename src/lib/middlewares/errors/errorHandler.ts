import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import {
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
} from './index';
import WinstonLogger from '../../../utilies/logger';

const logger = WinstonLogger.getInstance();

const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// validationError를 위한 코드
	if (Array.isArray(err) && err.every((e) => e instanceof ValidationError)) {
		const errorMessages = err.map((e: ValidationError) => {
			const { constraints } = e;
			return Object.values(constraints!).join(', ');
		});
		res.status(400).send({
			message: 'VALIDATION_ERROR',
			code: 400,
			errors: errorMessages.join('; '),
		});
	} else if (err instanceof BadRequestError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof UnauthorizedError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof ForbiddenError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof InternalServerError) {
		res
			.status(err.code)
			.send({ message: err.message, code: err.errorCode, errors: err.data });
	} else if (err instanceof NotFoundError) {
		res.status(err.code).send({ message: 'NOT_FOUND' });
	} else {
		logger.error(JSON.stringify(err));
		res.status(500).send({ message: 'INTERNAL_SERVER_ERROR' });
	}
};

export { errorHandler };
