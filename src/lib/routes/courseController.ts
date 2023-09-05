import { Router, Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import CourseService from '../services/courseService';
import checkAccessToken from '../middlewares/checkAccessToken';
import CreateCourseDto from '../types/requestTypes/createCoures.dto';
import UpdateCourseDto from '../types/requestTypes/updateCourse.dto';
import { BadRequestError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import UpdateCourseReviewDto from '../types/requestTypes/updateCourseReview.dto';
import CreateCourseReviewDto from '../types/requestTypes/createCourseReview.dto';
import EntireCourseDto from '../types/responseTypes/entireCourse.dto';

const router = Router();
const courseService = CourseService.getInstance();

router.post(
	'/courses',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const createCourseDto = new CreateCourseDto(req.body);

			await validateOrReject(createCourseDto);

			await courseService.createCourse(
				req.userUUID,
				createCourseDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.get(
	'/courses/me',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const courses = await courseService.getMyCourses(req.userUUID);

			res.json({ data: courses });
		} catch (error) {
			next(error);
		}
	}
);

router.get(
	'/courses/:courseUUID',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID } = req.params;

			if (!courseUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const courseData = await courseService.getCourse(
				req.userUUID,
				courseUUID
			);

			const course = new EntireCourseDto(courseData);

			res.json({ data: course });
		} catch (error) {
			next(error);
		}
	}
);

router.patch(
	'/courses/:courseUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID } = req.params;

			if (!courseUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const updateCourseDto = new UpdateCourseDto(req.body);

			await validateOrReject(updateCourseDto);

			await courseService.updateCourse(
				req.userUUID,
				courseUUID,
				updateCourseDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/courses/:courseUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID } = req.params;

			if (!courseUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await courseService.removeCourse(req.userUUID, courseUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/courses/:courseUUID/like',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID } = req.params;

			if (!courseUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await courseService.likeCourse(req.userUUID, courseUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/courses/:courseUUID/like',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID } = req.params;

			if (!courseUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await courseService.unlikeCourse(req.userUUID, courseUUID);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/courses/:courseUUID/review',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID } = req.params;

			if (!courseUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const createCourseReviewDto = new CreateCourseReviewDto(req.body);

			await validateOrReject(createCourseReviewDto);

			await courseService.createCourseReview(
				req.userUUID,
				courseUUID,
				createCourseReviewDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.patch(
	'/courses/:courseUUID/reviews/:courseReviewUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID, courseReviewUUID } = req.params;

			if (!courseUUID || !courseReviewUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			const updateCourseReviewDto = new UpdateCourseReviewDto(req.body);

			await validateOrReject(updateCourseReviewDto);

			await courseService.updateCourseReview(
				req.userUUID,
				courseUUID,
				courseReviewUUID,
				updateCourseReviewDto.toServiceModel()
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/courses/:courseUUID/reviews/:courseReviewUUID',
	checkAccessToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { courseUUID, courseReviewUUID } = req.params;

			if (!courseUUID || !courseReviewUUID) {
				throw new BadRequestError(ErrorCode.INVALID_QUERY, [
					{ data: 'Invalid query' },
				]);
			}

			await courseService.removeCourseReview(
				req.userUUID,
				courseUUID,
				courseReviewUUID
			);

			res.json({ data: true });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
