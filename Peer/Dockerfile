FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 50052
EXPOSE 50053

CMD ["node", "index.js"]
