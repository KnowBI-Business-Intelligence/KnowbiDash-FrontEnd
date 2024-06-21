FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

COPY server.crt /app/server.crt
COPY server.key /app/server.key

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--ssl", "--host", "0.0.0.0", "--port", "443"]
