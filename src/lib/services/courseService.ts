import { v4 } from 'uuid';
import { Client } from '@elastic/elasticsearch';
import {
	Course,
	CourseEntireInfo,
	CreateCourseForm,
	CreateCourseReviewForm,
	ElasticSearchResponse,
	UpdateCourseReviewForm,
} from '../types/type';
import { BadRequestError, InternalServerError } from '../middlewares/errors';
import ErrorCode from '../types/customTypes/error';
import ModelConverter from '../../utilies/converter/modelConverter';
import { CourseModel } from '../../database/models/course';
import { CourseLikeModel } from '../../database/models/courseLike';
import { CourseReviewModel } from '../../database/models/courseReview';
import { StoreModel } from '../../database/models/store';
import Elastic from '../../utilies/elastic';

const elastic = Elastic.getInstance();

class CourseService {
	private static instance: CourseService;

	private elasticClient: Client;

	private constructor() {
		this.elasticClient = elastic.getClient();
	}

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

		const promises = tags.map((tag) => {
			return this.elasticClient.index({
				index: tag,
				body: {
					courseUUID: newUUID,
				},
			});
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

	/**
	 * 태그로 코스 검색 (elasticsearch)
	 * @param tag
	 */
	async findCourseByTag(tag: string): Promise<Course[]> {
		try {
			const searchResults: ElasticSearchResponse =
				await this.elasticClient.search({
					index: tag,
				});

			if (
				typeof searchResults.body === 'boolean' ||
				!searchResults.statusCode ||
				!searchResults.headers
			) {
				throw new InternalServerError(ErrorCode.UNCATCHED_ERROR, [
					{ data: 'Elastic search error' },
				]);
			}

			const courseUUIDs = searchResults.body.hits.hits.map((searchResult) => {
				return searchResult._source.courseUUID;
			});

			const courses = await CourseModel.find({
				uuid: { $in: courseUUIDs },
				deletedAt: null,
			});

			return courses.map((course) => ModelConverter.toCourse(course));
		} catch (error: any) {
			// elastic search는 해당 index가 존재하지 않다면 에러가 발생하기 때문에 따로 try-catch로 처리
			if (error.meta?.body?.status === 404) {
				return [];
			}

			throw new InternalServerError(ErrorCode.UNCATCHED_ERROR, [
				{ data: 'Elastic search error' },
			]);
		}
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
		await likeHistory.save();
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
}

export default CourseService;
