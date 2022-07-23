#! /bin/sh
set -e
cd "$(dirname "$0")"

docker-compose down
docker-compose up -d mysql

MYSQL_CONTAINER="practice.mysql"
TYPEORM_PORT=3306
TYPEORM_PASSWORD="password"
TYPEORM_DATABASE="test"

i=0
while [ $i -lt 60 ]; do
    set +e
    found=$(docker logs ${MYSQL_CONTAINER} 2>&1 | grep -c "socket: '/var/run/mysqld/mysqld.sock'  port: ${TYPEORM_PORT}")
    set -e

    if [ $found -gt 0 ]; then
        docker exec ${MYSQL_CONTAINER} mysql -p$TYPEORM_PASSWORD -e "drop database if exists ${TYPEORM_DATABASE};create database ${TYPEORM_DATABASE};"

        echo 'mysql booting success.('$i's)'
        break
    else
        echo "wait for booting...$i"

        i=$(($i + 1))
        sleep 1s
    fi
done

docker exec ${MYSQL_CONTAINER} mysql -p$TYPEORM_PASSWORD -e "drop database if exists ${TYPEORM_DATABASE};create database ${TYPEORM_DATABASE};"

docker-compose up -d
