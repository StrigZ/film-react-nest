FROM node:24-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
CMD ["sh", "-c", "cp -r dist/. /static/"]
