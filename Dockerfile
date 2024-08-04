FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Optionally set executable permissions if necessary
RUN chmod +x ./node_modules/.bin/rimraf
RUN chmod +x ./node_modules/.bin/nest

RUN npm run build-w

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

EXPOSE 4000

CMD ["node", "main.js"]