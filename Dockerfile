FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

# Get secret from git action
ARG DATABASE_URL
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME
ARG REDIS_URL
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

# Copy secret to ENV
ENV NODE_ENV=production
ENV DATABASE_URL=$DATABASE_URL
ENV DATABASE_USER=$DATABASE_USER
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD
ENV DATABASE_NAME=$DATABASE_NAME
ENV REDIS_URL=$REDIS_URL
ENV FRONT_PORT=$FRONT_PORT
ENV ACCESS_TOKEN_SECRET_KEY=$ACCESS_TOKEN_SECRET_KEY
ENV ACCESS_TOKEN_EXPIRE_TIME=$ACCESS_TOKEN_EXPIRE_TIME
ENV REFRESH_TOKEN_SECRET_KEY=$REFRESH_TOKEN_SECRET_KEY
ENV REFRESH_TOKEN_EXPIRE_TIME=$REFRESH_TOKEN_EXPIRE_TIME
ENV EMAIL_VERIFY_TOKEN_SECRET_KEY=$EMAIL_VERIFY_TOKEN_SECRET_KEY
ENV EMAIL_VERIFY_TOKEN_EXPIRE_TIME=$EMAIL_VERIFY_TOKEN_EXPIRE_TIME
ENV HASH_SALT_ROUNDS=$HASH_SALT_ROUNDS
ENV KAKAO_CLIENT_ID=$KAKAO_CLIENT_ID
ENV KAKAO_REDIRECT_URI=$KAKAO_REDIRECT_URI
ENV AWS_ACCESS_KEY=$AWS_ACCESS_KEY
ENV AWS_SECRET_KEY=$AWS_SECRET_KEY
ENV AWS_SES_SENDER=$AWS_SES_SENDER

EXPOSE 4000

CMD ["node", "dist/src/server.js"]