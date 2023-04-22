import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'to1step api docs',
			description: 'to1step api 문서랍니다',
		},
		servers: [
			{
				url: 'http://localhost:4000/v1',
			},
		],
	},
	apis: ['src/lib/routes/*.ts', 'src/database/models/*.ts'], // 절대경로로 작성해주어야 작동
};
const swaggerOption = swaggerJsdoc(options);

export default swaggerOption;
