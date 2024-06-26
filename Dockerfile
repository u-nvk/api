FROM --platform=linux/amd64 node:18-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install -g knex

RUN npm i

COPY ./src ./src
COPY ./tsconfig-paths-bootstrap.js ./tsconfig-paths-bootstrap.js
COPY ./tsconfig.json ./tsconfig.json

RUN npm run build

CMD ["sh", "-c", "npm run migrate-latest && npm run start"]
