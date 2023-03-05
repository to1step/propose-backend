import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import cors from 'cors';
import helmet from 'helmet';

const app = express();

// swagger
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerSpec = YAML.load(path.join(__dirname, "swagger.yaml"));

// 서버 가동
dotenv.config();
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

app.all('/*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res, next) => {
	res.json('Server working');
});

// swagger
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, { explorer: true }) //검색 허용가능
// );

app.listen(4000, () => {
	console.log(`
  ################################################
  🛡️  Server listening on port: 4000🛡️
  ################################################
`);
});
