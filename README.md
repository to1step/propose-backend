# 

## Web Application

Web application project built with TypeScript, Express.js

<br/>

## Tech Stack

- TypeScript, Express.js,
- Mongoose, Redis, AWS-S3, AWS-SES
- Prettier, Husky

<br/>

## Folder Structure

|—`.github/workflows` About CI/CD
|—`.husky`  Husky setting
|— `src`  |— `database` Database Setting

          |— `lib` |— `middlewares` About middlewares

                   |—  `routes` About controllers

             |— `services` About services

             |— `types` Type definiiton

         |— `utilies` Util Library Setting 

         |— `app.ts` Root file

|—  `.node-version` Node.version

|— `nodemon.json` Nodemon Setting

|— `tsconfig.json` TypeScript configuration

<br/>

## Getting Started

- Install libaries

```tsx
$ npm install
```

- Fill your environment variables in .env File, and save in root

```tsx
DATABASE_URL=***
DATABASE_USER=***
DATABASE_PASSWORD=***
DATABASE_NAME=***

ELASTIC_URL=***

REDIS_URL=***

FRONT_PORT=***

ACCESS_TOKEN_SECRET_KEY=***
ACCESS_TOKEN_EXPIRE_TIME=***
REFRESH_TOKEN_SECRET_KEY=***
REFRESH_TOKEN_EXPIRE_TIME=***

HASH_SALT_ROUNDS=***
EMAIL_VERIFY_TOKEN_SECRET_KEY=***
EMAIL_VERIFY_TOKEN_EXPIRE_TIME=***

KAKAO_CLIENT_ID=***
KAKAO_REDIRECT_URI=***

AWS_ACCESS_KEY=***
AWS_SECRET_KEY=***
AWS_SES_SENDER=***

S3_ACCESS_KEY=***
S3_SECRET_KEY=***
S3_REGION=***
S3_BUCKET=***

DISCORD_BOT_TOKEN=***
DISCORD_PROD_CHANNEL_ID=***
DISCORD_DEV_CHANNEL_ID=***

LOG_PATH=***
```

- start with local environment

```tsx
$ npm run start_local
```

- start with development environment
