# Stap 1: de site bouwen met Eleventy.
FROM node:22-alpine AS bouw
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stap 2: alleen de gebouwde bestanden serveren met nginx.
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=bouw /app/_site /usr/share/nginx/html
