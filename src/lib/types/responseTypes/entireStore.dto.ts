import { StoreImage, StoreReview, StoreReviewWithUser } from '../type';
import { StoreCategory } from '../../../database/types/enums';

class EntireStoreDto {
	uuid: string;

	name: string;

	category: StoreCategory;

	description: string;

	location: string;

	coordinates: number[];

	representImage: string | null;

	tags: string[] | [];

	startTime: string | null;

	endTime: string | null;

	storeReviews: StoreReviewWithUser[];

	storeReviewImages: StoreImage[];

	reviewCount: number;

	likeCount: number;

	iLike: boolean;

	constructor(obj: EntireStoreDto) {
		this.uuid = obj.uuid;
		this.name = obj.name;
		this.category = obj.category;
		this.description = obj.description;
		this.location = obj.location;
		this.coordinates = obj.coordinates;
		this.representImage = obj.representImage;
		this.tags = obj.tags;
		this.startTime = obj.startTime;
		this.endTime = obj.endTime;
		this.storeReviews = obj.storeReviews;
		this.storeReviewImages = obj.storeReviewImages;
		this.reviewCount = obj.reviewCount;
		this.likeCount = obj.likeCount;
		this.iLike = obj.iLike;
	}
}

export default EntireStoreDto;
