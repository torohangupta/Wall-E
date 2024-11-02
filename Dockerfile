FROM node:lts-bullseye-slim
RUN apt-get update && apt-get install -y openssl libssl-dev
WORKDIR /opt/bot
## Install Dep
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]