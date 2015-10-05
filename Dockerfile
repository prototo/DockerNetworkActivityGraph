FROM node

ADD . /app
WORKDIR /app
RUN npm install

CMD node inspect/index.js
