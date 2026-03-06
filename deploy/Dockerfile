FROM node:25.2 AS builder

RUN npm install -g @nestjs/cli

COPY ./ ./app

WORKDIR /app

RUN yarn install --ignore-engines

RUN npm run build

#Stage 2
#######################################

FROM nginx:1.19.0
ARG SERVICE_PATH
ARG DEPLOY

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .${SERVICE_PATH}

COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s|/service_path|${SERVICE_PATH}|g" /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
