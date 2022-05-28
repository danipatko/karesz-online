FROM node:latest AS node_base

FROM mcr.microsoft.com/dotnet/sdk:6.0.201-bullseye-slim-amd64

COPY --from=node_base . .

RUN  apt update \
	&& apt install -y nodejs npm

WORKDIR /app

RUN mkdir /home/testing

COPY package*.json ./

# RUN npm i
RUN npm i && npm i --save-dev typescript @types/react @types/node ts-node

COPY ./ ./

RUN cp test.runtimeconfig.json /home/testing/

CMD ["npm", "run", "dev"]
