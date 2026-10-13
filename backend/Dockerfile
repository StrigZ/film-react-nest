FROM node:24-alpine AS build
WORKDIR /backend
COPY package.json .
COPY package-lock.json .
COPY .npmrc .
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS start
WORKDIR /backend
COPY package.json .
COPY package-lock.json .
COPY .npmrc .
RUN npm ci --omit=dev
COPY --from=build /backend/dist ./dist 
COPY --from=build /backend/public ./public
CMD ["node", "dist/main"]