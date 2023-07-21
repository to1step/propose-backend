import { de_CH, Faker, ko } from '@faker-js/faker';
import { StoreModel } from '../src/database/models/store';

const faker = new Faker({
	locale: [ko, de_CH],
});

const seedingStores = async () => {
	const numbers = [];

	for (let i = 1; i <= 50; i += 1) {
		numbers.push(i);
	}

	numbers.map(async () => {
		const name = `${faker.name.lastName()}의 카페`;
		const category = Math.floor(Math.random() * 3);
		const description = faker.lorem.sentence();
		const location = `${faker.lorem.word()} ${faker.lorem.word()} ${faker.lorem.word()}`;
		const locationSplit = location.split(' ');
		let shortLocation;
		if (locationSplit.length < 2) {
			// 주소가 한단어 이하인 경우 그냥 주소룰 할당
			shortLocation = location;
		} else {
			// 두 글자 이상인 경우 앞 문자 두개 저장
			shortLocation = `${locationSplit[0]} ${locationSplit[1]}`;
		}

		const coordinates = [faker.address.latitude(), faker.address.longitude()];
		const representImage = faker.image.imageUrl();
		const tags = [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()];

		return new StoreModel({
			user: '379bca7a-45cd-4a0e-b0aa-2f437de0e127',
			uuid: faker.datatype.uuid(),
			name: name,
			category: category,
			description: description,
			location: location,
			shortLocation: shortLocation,
			coordinates: coordinates,
			representImage: representImage,
			tags: tags,
			startTime: '오전 10시',
			endTime: '오후 10시',
			allowed: true,
		}).save();
	});
};

export { seedingStores };
