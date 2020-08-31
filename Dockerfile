FROM node:10.15.3-stretch as build-stage
COPY package.json .
RUN npm install

FROM node:10.15.3-stretch as production-stage

ARG ENV
ARG ROOT
ENV ROOT ${ROOT:-/app}
ARG TZ
ENV TZ ${TZ:-Asia/Jakarta}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR ${ROOT}
COPY --from=build-stage /node_modules /app/node_modules
EXPOSE 80
ENV NODE_ENV=$ENV
