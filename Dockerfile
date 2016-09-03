FROM node:6.3
MAINTAINER Simar Mangat <smangat@stanford.edu>

RUN mkdir -p /app
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

ENV NODE_ENV=production PORT=80
RUN ./node_modules/.bin/babel src -D -s --ignore __tests__,__mocks__ --out-dir dist && \
    rm -rf src && \
    npm prune

EXPOSE 80
CMD node dist/index.js
