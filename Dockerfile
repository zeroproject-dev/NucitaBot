FROM node:22.22-alpine3.22

ENV TZ="America/La_Paz"

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm set progress=false && npm config set audit false && npm config set fund false && npm ci --no-audit

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./enviroment.d.ts .

CMD ["npm", "run", "start"]
