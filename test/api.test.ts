import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { RedisClientType } from 'redis';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';
import { UserModel } from '../src/database/models/user';
import Redis from '../src/utilies/redis';
import { StoreModel } from '../src/database/models/store';
import { StoreReviewModel } from '../src/database/models/storeReview';
import { StoreReview } from '../src/lib/types/type';
import { CourseReviewModel } from '../src/database/models/courseReview';
import { CourseModel } from '../src/database/models/course';

dotenv.config();

describe('API Test', () => {
	let token: string;
	let userUUID: string;
	let redis: RedisClientType;

	beforeAll(async () => {
		const mongoUri = `${process.env.TEST_DATABASE_URL}`;

		const connectOption = {
			user: process.env.TEST_DATABASE_USER,
			pass: process.env.TEST_DATABASE_PASSWORD,
			dbName: process.env.TEST_DATABASE_NAME,
			heartbeatFrequencyMS: 2000,
		};

		await mongoose.connect(mongoUri, connectOption);

		redis = Redis.getInstance().getClient();
	});

	describe('AUTH API TEST', () => {
		test('Create test user', async () => {
			userUUID = v4();
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash('pass1', salt);

			await new UserModel({
				uuid: userUUID,
				email: 'test@naver.com',
				password: hashedPassword,
				nickname: 'test',
				provider: 'local',
				snsId: null,
			}).save();
		});

		describe('SIGN-UP TEST', () => {
			// 중복인 이메일
			test('[POST] /v1/auth/local/email-validation', async () => {
				await request(app)
					.post('/v1/auth/local/email-validation')
					.send({
						// post 데이터
						email: 'test@example.com',
					})
					.expect({ data: false });
			});

			// 중복이 아닌 이메일
			test('[POST] /v1/auth/local/email-validation', async () => {
				await request(app)
					.post('/v1/auth/local/email-validation')
					.send({
						// post 데이터
						email: 'test@naver.com',
					})
					.expect({ data: true });
			});

			// 중복인 닉네임
			test('[POST] /v1/auth/local/nickname-validation', async () => {
				await request(app)
					.post('/v1/auth/local/nickname-validation')
					.send({
						nickname: 'test',
					})
					.expect({ data: true });
			});

			// 중복이 아닌 닉네임
			test('[POST] /v1/auth/local/nickname-validation', async () => {
				await request(app)
					.post('/v1/auth/local/nickname-validation')
					.send({
						nickname: 'test2',
					})
					.expect({ data: false });
			});

			test('[POST] /v1/auth/local/email-code', async () => {
				await request(app)
					.post('/v1/auth/local/email-code')
					.send({
						email: 'test@example.com',
						nickname: 'test2',
						password: '1234',
					})
					.expect({ data: true });
			});
		});

		describe('SIGN-IN/OUT TEST', () => {
			// 로그인 성공
			test('[POST] /v1/auth/local/sign-in', async () => {
				await request(app)
					.post('/v1/auth/local/sign-in')
					.send({
						email: 'test@naver.com',
						password: 'pass1',
					})
					.expect({ data: true });
			});

			test('Create token', async () => {
				const user = await UserModel.findOne({
					email: 'test@naver.com',
				});

				token = jwt.sign(
					{ userUUID: user!.uuid },
					`${process.env.ACCESS_TOKEN_SECRET_KEY}`,
					{
						algorithm: 'HS256',
						expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_TIME}`,
					}
				);
			});

			// 로그인 실패 - 아이디 오류
			test('[POST] /v1/auth/local/sign-in', async () => {
				await request(app)
					.post('/v1/auth/local/sign-in')
					.send({
						email: 'wrong@naver.com',
						password: 'pass1',
					})
					.expect({
						message: 'BAD_REQUEST',
						code: 1200,
						errors: [{ data: 'User not found' }],
					});
			});

			// 로그인 실패 - 비밀번호 오류
			test('[POST] /v1/auth/local/sign-in', async () => {
				await request(app)
					.post('/v1/auth/local/sign-in')
					.send({
						email: 'test@naver.com',
						password: 'wrong',
					})
					.expect({
						message: 'BAD_REQUEST',
						code: 1001,
						errors: [{ data: 'Wrong password' }],
					});
			});
		});

		// 로그아웃
		describe('LOGOUT TEST', () => {
			test('[POST] /v1/auth/sign-out', async () => {
				await request(app)
					.post('/v1/auth/sign-out')
					.set('refresh_token', `${token}`)
					.expect({
						data: true,
					});
			});
		});
	});

	describe('STORE API TEST', () => {
		let storeUUID: string;
		let storeReviewUUID: string;
		describe('STORE POST TEST', () => {
			test('[POST] /v1/stores', async () => {
				await request(app)
					.post('/v1/stores')
					.send({
						name: 'testStore',
						description: 'test store description',
						category: 0,
						location: '서울시 동작구 **',
						coordinates: [123.123, 123.123],
						representImage: null,
						tags: [],
						startTime: null,
						endTime: null,
					})
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});

				const store = await StoreModel.findOne({ name: 'testStore' });
				storeUUID = store!.uuid;
			});

			test('[POST] /v1/stores/:storeUUID/like', async () => {
				await request(app)
					.post(`/v1/stores/${storeUUID}/like`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[POST] /v1/stores/:storeUUID/review', async () => {
				await request(app)
					.post(`/v1/stores/${storeUUID}/review`)
					.set('Authorization', `Bearer ${token}`)
					.send({
						review: 'test review',
					})
					.expect({
						data: true,
					});

				const review = await StoreReviewModel.findOne({
					review: 'test review',
				});
				storeReviewUUID = review!.uuid;
			});
		});

		describe('STORE GET TEST', () => {
			test('[GET] /v1/stores/me', async () => {
				await request(app)
					.get('/v1/stores/me')
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: [
							{
								uuid: storeUUID,
								name: 'testStore',
								category: 0,
								description: 'test store description',
								location: '서울시 동작구 **',
								coordinates: [123.123, 123.123],
								representImage: null,
								tags: [],
								startTime: null,
								endTime: null,
							},
						],
					});
			});

			test('[GET] /v1/stores/:storeUUID', async () => {
				await request(app)
					.get(`/v1/stores/${storeUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: {
							uuid: storeUUID,
							name: 'testStore',
							category: 0,
							description: 'test store description',
							location: '서울시 동작구 **',
							coordinates: [123.123, 123.123],
							representImage: null,
							tags: [],
							startTime: null,
							endTime: null,
							storeReviews: [
								{
									uuid: storeReviewUUID,
									user: userUUID,
									review: 'test review',
								},
							],
							reviewCount: 1,
							likeCount: 1,
							iLike: true,
						},
					});
			});
		});

		describe('STORE PATCH TEST', () => {
			test('[PATCH] /v1/stores/:storeUUID', async () => {
				await request(app)
					.patch(`/v1/stores/${storeUUID}`)
					.send({
						name: 'changeStore',
						description: 'change store description',
						category: 0,
						location: '서울시 동작구 **',
						coordinates: [123.123, 123.123],
						representImage: null,
						tags: [],
						startTime: null,
						endTime: null,
					})
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[PATCH] /v1/stores/:storeUUID/reviews/:storeReviewUUID', async () => {
				await request(app)
					.patch(`/v1/stores/${storeUUID}/reviews/${storeReviewUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.send({
						review: 'change review',
					})
					.expect({
						data: true,
					});
			});
		});

		describe('STORE DELETE TEST', () => {
			test('[DELETE] /v1/stores/:storeUUID/reviews/:storeReviewUUID', async () => {
				await request(app)
					.delete(`/v1/stores/${storeUUID}/reviews/${storeReviewUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[DELETE] /v1/stores/:storeUUID/like', async () => {
				await request(app)
					.delete(`/v1/stores/${storeUUID}/like`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[DELETE] /v1/stores/:storeUUID', async () => {
				await request(app)
					.delete(`/v1/stores/${storeUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});
		});
	});

	describe('COURSE API TEST', () => {
		let courseUUID: string;
		let courseReviewUUID: string;
		const storeUUIDs: string[] = [];

		test('Create test stores', async () => {
			for (let i = 0; i < 3; i += 1) {
				const newUUID = v4();
				storeUUIDs.push(newUUID);
				// eslint-disable-next-line no-await-in-loop
				await new StoreModel({
					user: userUUID,
					uuid: newUUID,
					name: `testStore${i}`,
					category: 0,
					description: `testStore${i} description`,
					shortLocation: '서울시 동작구',
					location: '서울시 동작구 **',
					coordinates: [123.123, 123.123],
					representImage: null,
					tags: [],
					startTime: null,
					endTime: null,
					allowed: true,
				}).save();
			}
		});

		describe('COURSE POST TEST', () => {
			test('[POST] /v1/courses', async () => {
				await request(app)
					.post('/v1/courses')
					.send({
						name: 'testCourse',
						stores: storeUUIDs,
						representImage: null,
						shortComment: 'test course shortComment',
						longComment: 'test course longComment',
						transports: [
							{
								startStore: storeUUIDs[0],
								endStore: storeUUIDs[1],
								comment: 'test comment',
								transportation: 1,
							},
							{
								startStore: storeUUIDs[1],
								endStore: storeUUIDs[2],
								comment: 'test comment',
								transportation: 1,
							},
						],
						isPrivate: false,
						tags: [],
					})
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});

				const course = await CourseModel.findOne({ name: 'testCourse' });
				courseUUID = course!.uuid;
			});

			test('[POST] /v1/courses/:courseUUID/like', async () => {
				await request(app)
					.post(`/v1/courses/${courseUUID}/like`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[POST] /v1/courses/:courseUUID/review', async () => {
				await request(app)
					.post(`/v1/courses/${courseUUID}/review`)
					.set('Authorization', `Bearer ${token}`)
					.send({
						review: 'test review',
					})
					.expect({
						data: true,
					});

				const review = await CourseReviewModel.findOne({
					review: 'test review',
				});
				courseReviewUUID = review!.uuid;
			});
		});

		describe('COURSE GET TEST', () => {
			test('[GET] /v1/courses/me', async () => {
				await request(app)
					.get('/v1/courses/me')
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: [
							{
								uuid: courseUUID,
								user: userUUID,
								name: 'testCourse',
								stores: storeUUIDs,
								representImage: null,
								shortComment: 'test course shortComment',
								longComment: 'test course longComment',
								isPrivate: false,
								transports: [
									{
										startStore: storeUUIDs[0],
										endStore: storeUUIDs[1],
										comment: 'test comment',
										transportation: 1,
									},
									{
										startStore: storeUUIDs[1],
										endStore: storeUUIDs[2],
										comment: 'test comment',
										transportation: 1,
									},
								],
								tags: [],
							},
						],
					});
			});

			test('[GET] /v1/courses/:courseUUID', async () => {
				await request(app)
					.get(`/v1/courses/${courseUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: {
							uuid: courseUUID,
							name: 'testCourse',
							stores: storeUUIDs,
							representImage: null,
							shortComment: 'test course shortComment',
							longComment: 'test course longComment',
							isPrivate: false,
							transports: [
								{
									startStore: storeUUIDs[0],
									endStore: storeUUIDs[1],
									comment: 'test comment',
									transportation: 1,
								},
								{
									startStore: storeUUIDs[1],
									endStore: storeUUIDs[2],
									comment: 'test comment',
									transportation: 1,
								},
							],
							tags: [],
							courseReviews: [
								{
									uuid: courseReviewUUID,
									user: userUUID,
									review: 'test review',
								},
							],
							reviewCount: 1,
							likeCount: 1,
							iLike: true,
						},
					});
			});
		});

		describe('COURSE PATCH TEST', () => {
			test('[PATCH] /v1/courses', async () => {
				await request(app)
					.patch(`/v1/courses/${courseUUID}`)
					.send({
						uuid: courseUUID,
						name: 'changeCourse',
						stores: storeUUIDs,
						representImage: null,
						shortComment: 'test change course shortComment',
						longComment: 'test change course longComment',
						transports: [
							{
								startStore: storeUUIDs[0],
								endStore: storeUUIDs[1],
								comment: 'test change comment',
								transportation: 1,
							},
							{
								startStore: storeUUIDs[1],
								endStore: storeUUIDs[2],
								comment: 'test change comment',
								transportation: 1,
							},
						],
						isPrivate: false,
						tags: [],
					})
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[PATCH] /v1/courses/:courseUUID/reviews/:courseReviewUUID', async () => {
				await request(app)
					.patch(`/v1/courses/${courseUUID}/reviews/${courseReviewUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.send({
						review: 'change review',
					})
					.expect({
						data: true,
					});
			});
		});

		describe('COURSE DELETE TEST', () => {
			test('[DELETE] /v1/courses/:courseUUID/reviews/:courseReviewUUID', async () => {
				await request(app)
					.delete(`/v1/courses/${courseUUID}/reviews/${courseReviewUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[DELETE] /v1/courses/:courseUUID/like', async () => {
				await request(app)
					.delete(`/v1/courses/${courseUUID}/like`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});

			test('[DELETE] /v1/courses/:courseUUID', async () => {
				await request(app)
					.delete(`/v1/courses/${courseUUID}`)
					.set('Authorization', `Bearer ${token}`)
					.expect({
						data: true,
					});
			});
		});
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
		await redis.disconnect();
	});
});
