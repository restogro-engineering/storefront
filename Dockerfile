## Use Node Slim image
FROM node:14-slim

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build:ssr:docker

## Start the application
CMD ["node", "dist/server/main.js"]