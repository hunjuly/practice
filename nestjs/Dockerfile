FROM node:16

WORKDIR /workspaces/practice

COPY . .

RUN npm ci --only=production

EXPOSE 3000

CMD [ "npm", "run" ,"start:prod"]
