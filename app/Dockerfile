FROM node:alpine3.15

WORKDIR /app

COPY package*.json ./

# RUN npm i
RUN npm i && npm i --save-dev typescript @types/react @types/node ts-node

COPY ./ ./

CMD ["npm", "run", "dev"]