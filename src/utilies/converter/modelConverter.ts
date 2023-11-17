import { UserDAO } from '../../database/models/user';
import { StoreDAO } from '../../database/models/store';
import { StoreReviewDAO } from '../../database/models/storeReview';
import {
	Course,
	CourseReview,
	Store,
	StoreImage,
	StoreReview,
	User,
} from '../../lib/types/type';
import { CourseReviewDAO } from '../../database/models/courseReview';
import { CourseDAO } from '../../database/models/course';
import { StoreImageDAO } from '../../database/models/storeImage';

class ModelConverter {
	static toUser(user: UserDAO): User {
		return {
			uuid: user.uuid,
			email: user.email,
			password: user.password,
			nickname: user.nickname,
			snsId: user.snsId,
			provider: user.provider,
			profileImage: user.profileImage,
			commentAlarm: user.commentAlarm,
			updateAlarm: user.updateAlarm,
		};
	}

	static toStore(store: StoreDAO): Store {
		return {
			uuid: store.uuid,
			name: store.name,
			category: store.category,
			description: store.description,
			location: store.location,
			coordinates: store.coordinates,
			representImage: store.representImage,
			tags: store.tags,
			startTime: store.startTime,
			endTime: store.endTime,
		};
	}

	static toStoreReview(storeReview: StoreReviewDAO): StoreReview {
		return {
			uuid: storeReview.uuid,
			user: storeReview.user,
			review: storeReview.review,
		};
	}

	static toStoreReviewImage(storeImage: StoreImageDAO): StoreImage {
		return {
			user: storeImage.user,
			store: storeImage.store,
			imageSrc: storeImage.imageSrc,
		};
	}

	static toCourse(course: CourseDAO): Course {
		return {
			uuid: course.uuid,
			user: course.user,
			userName: course.userName,
			name: course.name,
			stores: course.stores,
			representImage: course.representImage,
			shortComment: course.shortComment,
			longComment: course.longComment,
			isPrivate: course.isPrivate,
			transports: course.transports,
			tags: course.tags,
		};
	}

	static toCourseReview(courseReview: CourseReviewDAO): CourseReview {
		return {
			uuid: courseReview.uuid,
			user: courseReview.user,
			review: courseReview.review,
		};
	}
}

export default ModelConverter;
