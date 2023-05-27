import fs from 'fs';
import { S3 } from 'aws-sdk';

class S3Service {
	private static instance: S3Service;

	/**
	 * S3에 이미지 업로드
	 * @param folderPath
	 * @param files
	 */
	async uploadImages(folderPath: string, files: Express.Multer.File[]) {
		if (
			!process.env.S3_BUCKET ||
			!process.env.S3_ACCESS_KEY ||
			!process.env.S3_SECRET_KEY ||
			!process.env.S3_REGION
		) {
			throw new Error('Need S3 config');
		}
		const bucketName = process.env.S3_BUCKET;

		const s3 = new S3({
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
			region: process.env.S3_REGION,
		});

		const promiseList = files.map((file) => {
			const fileStream = fs.createReadStream(file.path);

			return s3
				.upload({
					Bucket: bucketName,
					Key: `${folderPath}/${file.originalname}`,
					Body: fileStream,
				})
				.promise();
		});

		const result = await Promise.all(promiseList);

		for (let i = 0; i < files.length; i += 1) {
			fs.unlink(files[i].path, (err) => {
				if (err) throw err;
			});
		}

		return result.map((s3Object) => s3Object.Location);
	}

	public static getInstance(): S3Service {
		if (!S3Service.instance) {
			S3Service.instance = new S3Service();
		}
		return S3Service.instance;
	}
}

export default S3Service;
