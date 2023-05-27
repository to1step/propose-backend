import S3Service from './s3Service';

class TestService {
	private static instance: TestService;

	s3Service: S3Service;

	constructor() {
		this.s3Service = S3Service.getInstance();
	}

	async uploadImages(files: Express.Multer.File[]) {
		const imageLocationList = await this.s3Service.uploadImages(
			'images',
			files
		);

		return imageLocationList;
	}

	public static getInstance(): TestService {
		if (!TestService.instance) {
			TestService.instance = new TestService();
		}
		return TestService.instance;
	}
}

export default TestService;
