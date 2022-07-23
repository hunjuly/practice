#! /bin/sh
set -e
cd "$(dirname "$0")"

docker rmi -f practice/nestjs
npm run build --prefix ../nestjs
docker build -t practice/nestjs ../nestjs

docker rmi -f practice/nextjs
npm run build --prefix ../nextjs
docker build -t practice/nextjs ../nextjs
