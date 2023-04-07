import swaggerJsDoc from 'swagger-jsdoc';

export const options = {
	swaggerDefinition: {
		openapi: '3.0.3',
		info: {
			title: 'to1step Api Docs',
			version: '1.0.0',
			description: 'to1step Api docs',
		},
		servers: [
			{
				url: 'http://localhost:4000',
				description: 'development url',
			},
		],
	},
	apis: [],
};

const swaggerOptions = swaggerJsDoc(options);

export default swaggerOptions;
