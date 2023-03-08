import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
// import { User } from '../database/models/models';

const app = express();

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

(async () => {
	await mongoose.connect(`${process.env.DATABASE_URL}`, {
		user: process.env.DATABASE_USER,
		pass: process.env.DATABASE_PASSWORD,
		dbName: process.env.DATABASE_NAME,
	});
	console.log('db connected!');
})();

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

// (async () => {
// 	const user = new User({
// 		name: 'Bill',
// 		email: 'bill@initech.com',
// 		avatar: 'https://i.imgur.com/dM7Thhn.png',
// 	});
// 	await user.save();
// })();
