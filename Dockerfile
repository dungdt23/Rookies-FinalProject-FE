# build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.19.0-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
