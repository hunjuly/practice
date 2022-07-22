#! /bin/sh
set -e
cd "$(dirname "$0")"

npm run build --prefix ../nestjs
docker build -t practice/nestjs ../nestjs

npm run build --prefix ../nextjs
docker build -t practice/nextjs ../nextjs

# docker-compose up
# docker logs nestjs

# exit 0

# docker rm -f test
# docker run -d --restart always \
#     -e "NODE_ENV=production" \
#     -e "LOG_STORAGE_PATH=./logs" \
#     -e "LOG_STORAGE_DAYS=14" \
#     -e "SESSION_TYPE=redis" \
#     -e "TYPEORM_TYPE=mysql" \
#     -e "TYPEORM_DATABASE=test" \
#     -e "TYPEORM_HOST=practice.mysql" \
#     -e "TYPEORM_PORT=3306" \
#     -e "TYPEORM_USERNAME=root" \
#     -e "TYPEORM_PASSWORD=password" \
#     -e "TYPEORM_ENABLE_SYNC=true" \
#     -e "REDIS_HOST=practice.redis" \
#     -e "REDIS_PORT=6379" \
#     -p 4000:4000 \
#     --name test \
#     --network vscode \
#     practice/nestjs

# docker inspect test

# docker logs -f test

# curl http://test:4000/users -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq
# curl http://test:4000/users/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v
# curl http://test:4000/users | jq
# curl http://test:4000/users/154db0e3-f9b7-48da-b275-00b7772be859 --cookie "connect.sid=s%3Aipawz6BxpLlcuC4ZIKdGfDFDOSg37Zkc.ARemWAt1LzBmYGZ%2BzGv%2BuJBqGMYZ9r55iea9sWERQIg;" | jq
