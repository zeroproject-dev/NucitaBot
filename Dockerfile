FROM node:20.15-alpine3.19

ENV TZ="America/La_Paz"

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm set progress=false && npm config set audit false && npm config set fund false && npm ci --no-audit

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./enviroment.d.ts .

CMD ["npm", "run", "start"]
