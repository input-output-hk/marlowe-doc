# syntax=docker/dockerfile:1

FROM node:20-alpine as base

WORKDIR /app

COPY --chown=node:node . /app

RUN yarn install --immutable

RUN yarn build

FROM nginx:1.23-alpine as serve

RUN echo $'server { \n\
  listen 8080; \n\
  root /usr/share/nginx/html; \n\
  index index.html; \n\
  server_name _; \n\
  location / { \n\
    try_files $uri $uri/ /index.html =404; \n\
  } \n\
}' > /etc/nginx/conf.d/default.conf

COPY --from=base /app/build /usr/share/nginx/html

EXPOSE 8080
