// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
// const resourceServer = express.Router();

// resourceServer.get('/oauth/authorize', (req, res, next) => {
// 	const email = req.body.email;
// 	const password = req.body.password;

// 	// 2. client_id에 해당하는 redirect_url과 query에 있는 redirect_url이 같은지 확인
// 	const client_id = req.query.client_id;
// 	const scope = req.query.scope;
// 	const redirect_uri = req.query.redirect_uri;

// 	// 3. 같으면 인가 코드(임시 비밀번호)를 query에 담아 redirect url을 client에게 전달
// 	const code = 'any';
// 	res.send(`http://localhost:4000/api/auth/redirect/local?code=${code}`);
// });

// resourceServer.get('/oauth/token', (req, res, next) => {
// 	// 5. rosourceServer의 client_id, client_secret, redirect_uri, 인가 코드 이 4가지가 모두 일치하는지 확인
// 	console.log(req.query.client_id);
// 	console.log(req.query.client_secret);
// 	console.log(req.query.redirect_uri);
// 	console.log(req.query.code);

// 	// 6. access토큰을 우리서버에게 발급
// 	const accessToken = 'any';
// 	const refreshToken = 'any';
// 	res.send({ accessToken: accessToken, refreshToken: refreshToken });
// });

// export { resourceServer };
