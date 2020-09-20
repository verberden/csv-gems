FROM node:12-alpine

WORKDIR /usr/src/app
RUN cd /usr/src/app && chown -R node:node /usr/src/app
COPY ./package.json ./
USER node

RUN npm install

COPY --chown=node:node . .