import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import cors from 'cors';
import helmet from 'helmet';

const app = express();

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

app.listen(4000, () => {
	console.log(`
  ################################################
  🛡️  Server listening on port: 4000🛡️
  ################################################
`);
});
