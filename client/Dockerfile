 FROM node:18 AS builder
 WORKDIR /app
 COPY package*.json ./
 RUN npm install
 COPY . .
 RUN npm run build

 FROM node:18-alpine
 WORKDIR /app
 COPY --from=builder /app ./
 EXPOSE 3000
 CMD ["npm", "run", "start"]

#FROM node:18-alpine
#
#WORKDIR /app
#
#COPY package*.json ./
#RUN npm install
#
#EXPOSE 3000
#
#CMD ["npm", "run", "dev"]
