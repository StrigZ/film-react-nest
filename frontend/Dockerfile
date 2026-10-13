FROM node:24-alpine AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS start
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["sh", "-c", "cp -r dist/. /static/"]
