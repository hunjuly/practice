FROM node:16
ENV NODE_ENV=production

WORKDIR /workspaces/practice

COPY . .

RUN npm ci --only=production

EXPOSE 4000

CMD [ "npm", "run" ,"start:prod"]
