import { StoreReview } from '../type';

class GetStoreDto {
	uuid: string;

	name: string;

	description: string;

	location: string;

	coordinates: number[];

	representImage: string | null;

	tags: string[] | [];

	startTime: string | null;

	endTime: string | null;

	storeReviews: StoreReview[];

	reviewCount: number;

	likeCount: number;

	iLike: boolean;

	constructor(obj: GetStoreDto) {
		this.uuid = obj.uuid;
		this.name = obj.name;
		this.description = obj.description;
		this.location = obj.location;
		this.coordinates = obj.coordinates;
		this.representImage = obj.representImage;
		this.tags = obj.tags;
		this.startTime = obj.startTime;
		this.endTime = obj.endTime;
		this.storeReviews = obj.storeReviews;
		this.reviewCount = obj.reviewCount;
		this.likeCount = obj.likeCount;
		this.iLike = obj.iLike;
	}
}

export default GetStoreDto;
