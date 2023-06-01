import { v4 } from 'uuid';
import {
	CourseEntireInfo,
	CreateCourseForm,
	CreateCourseReviewForm,
	UpdateCourseReviewForm,
} from '../types/type';
import { CourseModel } from '../../database/models/course';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import { CourseLikeModel } from '../../database/models/courseLike';
import { CourseReviewModel } from '../../database/models/courseReview';
import ModelConverter from '../../utilies/converter/modelConverter';
import { StoreModel } from '../../database/models/store';

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
			shortComment,
			longComment,
			isPrivate,
			transport,
			tags,
		} = createCourseForm;

		const newUUID = v4();

		// 가게들을 promise.all()로 병렬처리하여, 실제로 있는 가게인지 확인
		const promises = stores.map(async (storeUUID) => {
			const isExist = await StoreModel.exists({
				uuid: storeUUID,
				deletedAt: null,
			});

			// 하나라도 if문 걸리면 promise.all 종료
			if (!isExist) {
				throw new InternalServerError(ErrorCode.STORE_NOT_FOUND, [
					{ data: 'Course not found' },
				]);
			}
		});

		await Promise.all(promises);

		await new CourseModel({
			uuid: newUUID,
			user: userUUID,
			name: name,
			stores: stores,
			shortComment: shortComment,
			longComment: longComment,
			isPrivate: isPrivate,
			transport: transport,
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

		// TODO: course작성자의 닉네임을 넣어줘야 하는가?
		// TODO: 그렇다면 create할때 넣어줘야 하는가 get할때 넣어줘야 하는가?
		return {
			...courseData,
			courseReviews: courseReviewData,
			reviewCount,
			likeCount,
			iLike,
		};
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
			shortComment,
			longComment,
			isPrivate,
			transport,
			tags,
		} = createCourseForm;

		const course = await CourseModel.findOneAndUpdate(
			{
				uuid: courseUUID,
				user: userUUID,
				deletedAt: null,
			},
			{
				name: name,
				stores: stores,
				shortComment: shortComment,
				longComment: longComment,
				isPrivate: isPrivate,
				transport: transport,
				tags: tags,
			},
			{ new: true }
		);

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}
	}

	/**
	 * 가게 삭제
	 * @param userUUID
	 * @param courseUUID
	 */
	async removeCourse(userUUID: string, courseUUID: string): Promise<void> {
		const course = await CourseModel.findOneAndUpdate(
			{
				uuid: courseUUID,
				user: userUUID,
				deletedAt: null,
			},
			{
				deletedAt: new Date(),
			},
			{
				new: true,
			}
		);

		if (!course) {
			// 삭제되었거나 없는 가게일 경우
			throw new InternalServerError(ErrorCode.COURSE_NOT_FOUND, [
				{ data: 'Course not found' },
			]);
		}
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

		await new CourseLikeModel({
			user: userUUID,
			course: courseUUID,
		}).save();
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

		const likeHistory = await CourseLikeModel.findOneAndUpdate(
			{
				user: userUUID,
				course: courseUUID,
				deletedAt: null,
			},
			{ deletedAt: new Date() },
			{ new: true }
		);

		if (!likeHistory) {
			// 좋아요를 하지 않았는데 취소하는 경우
			throw new BadRequestError(ErrorCode.COURSE_LIKE_NOT_FOUND, [
				{ data: 'Like not found' },
			]);
		}
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

		await new CourseReviewModel({
			uuid: newUUID,
			user: userUUID,
			course: courseUUID,
			review: review,
		}).save();
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

		const courseReview = await CourseReviewModel.findOneAndUpdate(
			{
				uuid: courseReviewUUID,
				course: courseUUID,
				user: userUUID,
				deletedAt: null,
			},
			{ review: review },
			{ new: true }
		);

		if (!courseReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new InternalServerError(ErrorCode.COURSE_REVIEW_NOT_FOUND, [
				{ data: { data: 'Course review not found' } },
			]);
		}
	}

	async removeCourseReview(
		userUUID: string,
		courseUUID: string,
		courseReviewUUID: string
	): Promise<void> {
		const courseReview = await CourseReviewModel.findOneAndUpdate(
			{
				uuid: courseReviewUUID,
				course: courseUUID,
				user: userUUID,
				deletedAt: null,
			},
			{ deletedAt: new Date() },
			{ new: true }
		);

		if (!courseReview) {
			// 해당 리뷰가 존재하지 않는 경우
			throw new InternalServerError(ErrorCode.COURSE_REVIEW_NOT_FOUND, [
				{ data: 'Course review not found' },
			]);
		}
	}
}

export default CourseService;
