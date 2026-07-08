FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads/profiles uploads/groups uploads/posts

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "index.js"]
