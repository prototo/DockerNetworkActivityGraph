FROM node

ADD . /app
WORKDIR /app
RUN npm install
RUN npm install -g browserify watchify

CMD node index.js
