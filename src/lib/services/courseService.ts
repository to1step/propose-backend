import { v4 } from 'uuid';
import {
	Course,
	CourseEntireInfo,
	CreateCourseForm,
	CreateCourseReviewForm,
	UpdateCourseReviewForm,
} from '../types/type';
import ModelConverter from '../../utilies/converter/modelConverter';
import Redis from '../../utilies/redis';
import GetTimeKr from '../../utilies/dayjsKR';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import { CourseModel } from '../../database/models/course';
import { CourseLikeModel } from '../../database/models/courseLike';
import { CourseReviewModel } from '../../database/models/courseReview';
import { StoreModel } from '../../database/models/store';
import { CourseScoreModel } from '../../database/models/courseScore';

const redis = Redis.getInstance().getClient();

const dayjsKR = GetTimeKr.getInstance();

class CourseService {
	private static instance: CourseService;

	private constructor() {}

	public static getInstance(): CourseService {
		if (!CourseService.instance) {
			CourseService.instance = new CourseService();
		}
		return CourseService.instance;
	}

	/**
	 * course 생성
	 * @param userUUID
	 * @param createCourseForm
	 */
	async createCourse(
		userUUID: string,
		createCourseForm: CreateCourseForm
	): Promise<void> {
		const {
			name,
			stores,
			representImage,
			shortComment,
			longComment,
			isPrivate,
			transports,
			tags,
		} = createCourseForm;

		// 실제로 있는 가게인지 확인
		const isExist = await StoreModel.find({
			uuid: { $in: stores },
			deletedAt: null,
		});

		if (isExist.length !== stores.length) {
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const newUUID = v4();

		await new CourseModel({
			uuid: newUUID,
			user: userUUID,
			name: name,
			stores: stores,
			representImage: representImage,
			shortComment: shortComment,
			longComment: longComment,
			isPrivate: isPrivate,
			transports: transports,
			tags: tags,
		}).save();
	}

	/**
	 * 코스 정보 가져오기
	 * @param userUUID
	 * @param courseUUID
	 */
	async getCourse(
		userUUID: string,
		courseUUID: string
	): Promise<CourseEntireInfo> {
		const course = await CourseModel.findCourseByUUID(courseUUID);

		if (course === null) {
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}

		const courseData = ModelConverter.toCourse(course);

		const { isPrivate, user } = courseData;

		// 비공개인 남의 코스를 가져오려 하는 경우
		if (isPrivate && user !== userUUID) {
			throw new BadRequestError(ErrorCode.PRIVATE_COURSE, [
				{ data: 'Private course' },
			]);
		}

		const [courseReviews, courseLikes] = await Promise.all([
			CourseReviewModel.findCourseReviewByStore(courseUUID),
			CourseLikeModel.find({ course: courseUUID, deletedAt: null }),
		]);

		const courseReviewData = courseReviews.map((courseReview) =>
			ModelConverter.toCourseReview(courseReview)
		);

		const reviewCount = courseReviews.length;

		const likeCount = courseLikes.length;

		let iLike = false;

		for (let i = 0; i < likeCount; i += 1) {
			if (courseLikes[i].user === userUUID) {
				iLike = true;
				break;
			}
		}

		return {
			...courseData,
			courseReviews: courseReviewData,
			reviewCount,
			likeCount,
			iLike,
		};
	}

	async getMyCourse(userUUID: string): Promise<Course[]> {
		const courses = await CourseModel.find({
			user: userUUID,
			deletedAt: null,
		});

		if (courses.length === 0) {
			return [];
		}

		return courses.map((course) => {
			return ModelConverter.toCourse(course);
		});
	}

	/**
	 * course 수정
	 * @param userUUID
	 * @param courseUUID
	 * @param createCourseForm
	 */
	async updateCourse(
		userUUID: string,
		courseUUID: string,
		createCourseForm: CreateCourseForm
	): Promise<void> {
		const {
			name,
			stores,
			representImage,
			shortComment,
			longComment,
			isPrivate,
			transports,
			tags,
		} = createCourseForm;

		// 실제로 있는 가게인지 확인
		const isExist = await StoreModel.find({
			uuid: { $in: stores },
			deletedAt: null,
		});

		if (isExist.length !== stores.length) {
			throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
				{ data: 'Store not found' },
			]);
		}

		const course = await CourseModel.findOne({
			uuid: courseUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}

		course.name = name;
		course.stores = stores;
		course.representImage = representImage;
		course.shortComment = shortComment;
		course.longComment = longComment;
		course.isPrivate = isPrivate;
		course.transports = transports;
		course.tags = tags;

		await course.save();
	}

	/**
	 * 가게 삭제
	 * @param userUUID
	 * @param courseUUID
	 */
	async removeCourse(userUUID: string, courseUUID: string): Promise<void> {
		const course = await CourseModel.findOne({
			uuid: courseUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}

		course.deletedAt = new Date();
		await course.save();
	}

	/**
	 * 코스 좋아요
	 * @param userUUID
	 * @param courseUUID
	 */
	async likeCourse(userUUID: string, courseUUID: string): Promise<void> {
		const course = await CourseModel.findOne({
			uuid: courseUUID,
			deletedAt: null,
		});

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}

		const likeHistory = await CourseLikeModel.findOne({
			user: userUUID,
			course: courseUUID,
			deletedAt: null,
		});

		if (likeHistory) {
			// 좋아요를 이미 했는데 다시 좋아요를 누르는 경우
			throw new BadRequestError(ErrorCode.DUPLICATE_COURSE_LIKE_ERROR, [
				{ data: 'Duplicate course like' },
			]);
		}

		await Promise.all([
			this.scoreToCourse(courseUUID, 'add'),
			new CourseLikeModel({
				user: userUUID,
				course: courseUUID,
			}).save(),
		]);
	}

	/**
	 * 코스 좋아요 취소
	 * @param userUUID
	 * @param courseUUID
	 */
	async unlikeCourse(userUUID: string, courseUUID: string): Promise<void> {
		const course = await CourseModel.findOne({
			uuid: courseUUID,
			deletedAt: null,
		});

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}

		const likeHistory = await CourseLikeModel.findOne({
			user: userUUID,
			course: courseUUID,
			deletedAt: null,
		});

		if (!likeHistory) {
			// 좋아요를 하지 않았는데 취소하는 경우
			throw new BadRequestError(ErrorCode.COURSE_LIKE_NOT_FOUND, [
				{ data: 'Like not found' },
			]);
		}

		likeHistory.deletedAt = new Date();

		await Promise.all([
			this.scoreToCourse(courseUUID, 'sub'),
			likeHistory.save(),
		]);
	}

	/**
	 * 코스 리뷰 생성
	 * @param userUUID
	 * @param courseUUID
	 * @param createCourseReviewForm
	 */
	async createCourseReview(
		userUUID: string,
		courseUUID: string,
		createCourseReviewForm: CreateCourseReviewForm
	): Promise<void> {
		const { review } = createCourseReviewForm;

		const course = await CourseModel.findOne({
			uuid: courseUUID,
			deletedAt: null,
		});

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}

		const newUUID = v4();

		await Promise.all([
			this.scoreToCourse(courseUUID, 'add'),
			new CourseReviewModel({
				uuid: newUUID,
				user: userUUID,
				course: courseUUID,
				review: review,
			}).save(),
		]);
	}

	/**
	 * 코스 리뷰 업데이트
	 * @param userUUID
	 * @param courseUUID
	 * @param courseReviewUUID
	 * @param updateCourseReviewForm
	 */
	async updateCourseReview(
		userUUID: string,
		courseUUID: string,
		courseReviewUUID: string,
		updateCourseReviewForm: UpdateCourseReviewForm
	): Promise<void> {
		const { review } = updateCourseReviewForm;

		const courseReview = await CourseReviewModel.findOne({
			uuid: courseReviewUUID,
			course: courseUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!courseReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new InternalServerError(ErrorCode.COURSE_REVIEW_NOT_FOUND, [
				{ data: { data: 'Course review not found' } },
			]);
		}

		courseReview.review = review;
		await courseReview.save();
	}

	async removeCourseReview(
		userUUID: string,
		courseUUID: string,
		courseReviewUUID: string
	): Promise<void> {
		const courseReview = await CourseReviewModel.findOne({
			uuid: courseReviewUUID,
			course: courseUUID,
			user: userUUID,
			deletedAt: null,
		});

		if (!courseReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new InternalServerError(ErrorCode.COURSE_REVIEW_NOT_FOUND, [
				{ data: 'Course review not found' },
			]);
		}

		courseReview.deletedAt = new Date();
		await courseReview.save();
	}

	/**
	 * 코스에 점수 부여
	 * @param courseUUID
	 * @param type
	 */
	async scoreToCourse(courseUUID: string, type: 'add' | 'sub'): Promise<void> {
		const [sunStart, satEnd] = dayjsKR.getWeek();

		// 이번주(일~토)안에 등록되었는지 확인
		const courseScore = await CourseScoreModel.findOne({
			course: courseUUID,
			date: { $gt: sunStart, $lt: satEnd },
		});

		if (courseScore) {
			if (type === 'add') {
				courseScore.score += 1;
			} else {
				courseScore.score -= 1;
			}
			await courseScore.save();
		} else {
			// 없다면 score 1으로 생성
			await new CourseScoreModel({
				course: courseUUID,
				date: Date.now().toString(),
				score: type === 'add' ? 1 : 0,
			}).save();
		}
	}
}

export default CourseService;
