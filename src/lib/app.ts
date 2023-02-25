import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';

import cors from 'cors';
import helmet from 'helmet';

const app = express();
const httpServer = createServer(app);

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// swagger
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, { explorer: true }) //검색 허용가능
// );

httpServer.listen(80);
