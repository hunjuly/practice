FROM node:18-alpine

WORKDIR /workspaces/practice

COPY . .

RUN npm ci --omit=dev

EXPOSE 4000

CMD [ "npm", "start"]
