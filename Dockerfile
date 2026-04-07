FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npx tsc

FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=builder /app/dist/ ./dist/
COPY public/ ./public/
COPY videos/ ./videos/
COPY src/pages/ ./dist/pages/

EXPOSE 3000
CMD ["node", "dist/server.js"]
