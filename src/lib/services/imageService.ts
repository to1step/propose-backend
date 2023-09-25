import S3Service from './s3Service';

class ImageService {
	private static instance: ImageService;

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

	public static getInstance(): ImageService {
		if (!ImageService.instance) {
			ImageService.instance = new ImageService();
		}
		return ImageService.instance;
	}
}

export default ImageService;
