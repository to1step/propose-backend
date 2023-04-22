FROM node:16-alpine3.14

WORKDIR /usr/src/app

RUN NODE_ENV=production

COPY . /usr/src/app

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/src/server.js"]
