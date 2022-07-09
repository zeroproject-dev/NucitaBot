FROM node:lts-alpine3.15

WORKDIR /usr/src/app

COPY package.json .

RUN npm set progress=false
RUN npm install

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./enviroment.d.ts .

RUN npm run build

CMD ["npm", "run", "start:prod"]