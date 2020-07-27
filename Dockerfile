FROM node:10.17.0-alpine

WORKDIR /usr/src/app

RUN apk update && apk add git
COPY package.json /usr/src/app/

RUN npm i nuxt@1.4.2 -g
RUN npm i backpack-core@0.4.1 -g
RUN npm i --save-dev cross-env

COPY . /usr/src/app/
COPY .env /usr/src/app/.env

EXPOSE 8001

RUN node node_modules/cross-env/dist/bin/cross-env.js NODE_ENV=production nuxt build
RUN node node_modules/cross-env/dist/bin/cross-env.js NODE_ENV=production backpack build

CMD node --max_old_space_size=8192 build/main.js
