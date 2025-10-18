FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci


COPY . .

RUN npm run build


FROM node:18-alpine AS runner

WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start"]
