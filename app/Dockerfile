FROM node:latest AS node_base

RUN echo "Node version:" && node --version

FROM mcr.microsoft.com/dotnet/sdk:6.0.201-bullseye-slim-amd64

# RUN ls -la /usr/share/dotnet/sdk/6.0.201/Roslyn/bincore/

COPY --from=node_base . .

RUN  apt update \
	&& apt install -y nodejs npm

WORKDIR /app

RUN mkdir /home/testing

# COPY ./test.runtimeconfig.json /home/testing/test.runtimeconfig.json

COPY package*.json ./

# RUN npm i
RUN npm i && npm i --save-dev typescript @types/react @types/node ts-node

COPY ./ ./

RUN ls -la 

RUN cp test.runtimeconfig.json /home/testing/

CMD ["npm", "run", "dev"]
