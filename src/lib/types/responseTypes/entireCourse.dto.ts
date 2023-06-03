import { CourseReview, Transport } from '../type';

class EntireCourseDto {
	uuid: string;

	name: string;

	stores: string[];

	shortComment: string;

	longComment: string | null;

	isPrivate: boolean;

	transports: Transport[];

	tags: string[];

	courseReviews: CourseReview[];

	reviewCount: number;

	likeCount: number;

	iLike: boolean;

	constructor(obj: EntireCourseDto) {
		this.uuid = obj.uuid;
		this.name = obj.name;
		this.stores = obj.stores;
		this.shortComment = obj.shortComment;
		this.longComment = obj.longComment;
		this.isPrivate = obj.isPrivate;
		this.transports = obj.transports;
		this.tags = obj.tags;
		this.courseReviews = obj.courseReviews;
		this.reviewCount = obj.reviewCount;
		this.likeCount = obj.likeCount;
		this.iLike = obj.iLike;
	}
}

export default EntireCourseDto;
