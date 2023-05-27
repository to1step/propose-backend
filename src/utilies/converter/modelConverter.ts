import { UserDAO } from '../../database/models/user';
import { StoreDAO } from '../../database/models/store';
import { StoreReviewDAO } from '../../database/models/storeReview';
import { Store, StoreReview, User } from '../../lib/types/type';

class ModelConverter {
	static toUser(user: UserDAO): User {
		return {
			uuid: user.uuid,
			email: user.email,
			password: user.password,
			nickname: user.nickname,
			snsId: user.snsId,
			provider: user.provider,
		};
	}

	static toStore(store: StoreDAO): Store {
		return {
			uuid: store.uuid,
			name: store.name,
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
}

export default ModelConverter;
