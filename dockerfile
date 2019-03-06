FROM node:carbon

ARG MACHINE_NAME=pluginfactory_logbook
ENV MACHINE_NAME=pluginfactory_logbbook

WORKDIR /pluginfactory/apps/logbook

COPY package*.json ./

RUN npm install

COPY . .
RUN npm install -g pm2

EXPOSE 49100

CMD pm2-docker launcher.js --machine-name $MACHINE_NAME