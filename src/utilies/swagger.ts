import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.OAS3Options = {
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
	// src에 있는
	apis: ['src/**/*.ts'],
};
const swaggerOption = swaggerJSDoc(options);

export default swaggerOption;
