FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

RUN npm run api-docs

# Get secret from git action
ARG DATABASE_URL
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME
ARG PROD_REDIS_URL
ARG FRONT_PORT
ARG ACCESS_TOKEN_SECRET_KEY
ARG ACCESS_TOKEN_EXPIRE_TIME
ARG REFRESH_TOKEN_SECRET_KEY
ARG REFRESH_TOKEN_EXPIRE_TIME
ARG EMAIL_VERIFY_TOKEN_SECRET_KEY
ARG EMAIL_VERIFY_TOKEN_EXPIRE_TIME
ARG HASH_SALT_ROUNDS
ARG KAKAO_CLIENT_ID
ARG KAKAO_REDIRECT_URI
ARG AWS_ACCESS_KEY
ARG AWS_SECRET_KEY
ARG AWS_SES_SENDER
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG S3_REGION
ARG S3_BUCKET
ARG DISCORD_BOT_TOKEN
ARG DISCORD_PROD_CHANNEL_ID
ARG DISCORD_DEV_CHANNEL_ID
ARG MAIL_SERVICE
ARG MAIL_ID
ARG MAIL_PASSWORD
ARG MAIL_SENDER
ARG LOG_PATH

# Copy secret to ENV
ENV NODE_ENV=production \
 DATABASE_URL=$DATABASE_URL \
 DATABASE_USER=$DATABASE_USER \
 DATABASE_PASSWORD=$DATABASE_PASSWORD \
 DATABASE_NAME=$DATABASE_NAME \
 PROD_REDIS_URL=$PROD_REDIS_URL \
 FRONT_PORT=$FRONT_PORT \
 ACCESS_TOKEN_SECRET_KEY=$ACCESS_TOKEN_SECRET_KEY \
 ACCESS_TOKEN_EXPIRE_TIME=$ACCESS_TOKEN_EXPIRE_TIME \
 REFRESH_TOKEN_SECRET_KEY=$REFRESH_TOKEN_SECRET_KEY \
 REFRESH_TOKEN_EXPIRE_TIME=$REFRESH_TOKEN_EXPIRE_TIME \
 EMAIL_VERIFY_TOKEN_SECRET_KEY=$EMAIL_VERIFY_TOKEN_SECRET_KEY \
 EMAIL_VERIFY_TOKEN_EXPIRE_TIME=$EMAIL_VERIFY_TOKEN_EXPIRE_TIME \
 HASH_SALT_ROUNDS=$HASH_SALT_ROUNDS \
 KAKAO_CLIENT_ID=$KAKAO_CLIENT_ID \
 KAKAO_REDIRECT_URI=$KAKAO_REDIRECT_URI \
 AWS_ACCESS_KEY=$AWS_ACCESS_KEY \
 AWS_SECRET_KEY=$AWS_SECRET_KEY \
 AWS_SES_SENDER=$AWS_SES_SENDER \
 S3_ACCESS_KEY=$S3_ACCESS_KEY \
 S3_SECRET_KEY=$S3_SECRET_KEY \
 S3_REGION=$S3_REGION \
 S3_BUCKET=$S3_BUCKET \
 DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN \
 DISCORD_PROD_CHANNEL_ID=$DISCORD_PROD_CHANNEL_ID \
 DISCORD_DEV_CHANNEL_ID=$DISCORD_DEV_CHANNEL_ID \
 MAIL_SERVICE=$MAIL_SERVICE \
 MAIL_ID=$MAIL_ID \
 MAIL_PASSWORD=$MAIL_PASSWORD \
 MAIL_SENDER=$MAIL_SENDER \
 LOG_PATH=$LOG_PATH

EXPOSE 4000

CMD ["node", "dist/src/server.js"]
