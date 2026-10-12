FROM node:24-alpine
WORKDIR /backend
COPY package.json .
COPY package-lock.json .
COPY .npmrc .
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/main"]
