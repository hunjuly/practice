#! /bin/sh
set -e
cd "$(dirname "$0")"

CONTAINER=$(basename $WORKSPACE_ROOT)

DATABASE_TYPE='mysql'
DATABASE_DATABASE='test'
DATABASE_HOST=$CONTAINER
DATABASE_PORT='3306'
DATABASE_USERNAME='root'
DATABASE_PASSWORD='password'

mysql() {
    docker rm -f ${CONTAINER}
    docker volume rm -f ${CONTAINER}

    docker run \
        --platform linux/amd64 \
        -d --name ${CONTAINER} --network vscode \
        -p ${DATABASE_PORT}:${DATABASE_PORT} \
        -e MYSQL_ROOT_PASSWORD=${DATABASE_PASSWORD} \
        --mount source="${CONTAINER}",target=/var/lib/mysql,type=volume \
        mysql

    i=0
    while [ $i -lt 30 ]; do
        set +e
        found=$(docker logs ${CONTAINER} 2>&1 | grep -c "socket: '/var/run/mysqld/mysqld.sock'  port: ${DATABASE_PORT}")
        set -e

        if [ $found -gt 0 ]; then
            docker exec ${CONTAINER} mysql -p$DATABASE_PASSWORD -e "drop database if exists ${DATABASE_DATABASE};create database ${DATABASE_DATABASE};"
            echo 'mysql booting success.('$i's)'
            return 0
        else
            echo "wait for booting...$i"

            i=$(($i + 1))
            sleep 1s
        fi
    done

    echo 'mysql booting failed.'
    docker logs ${CONTAINER}
    return 1
}

writeEnv() {
    echo "DATABASE_TYPE=$DATABASE_TYPE" >../.env
    echo "DATABASE_DATABASE=$DATABASE_DATABASE" >>../.env
    echo "DATABASE_HOST=$DATABASE_HOST" >>../.env
    echo "DATABASE_PORT=$DATABASE_PORT" >>../.env
    echo "DATABASE_USERNAME=$DATABASE_USERNAME" >>../.env
    echo "DATABASE_PASSWORD=$DATABASE_PASSWORD" >>../.env
    echo "DATABASE_ENABLE_SYNC=true" >>../.env
}

mysql

writeEnv

echo 'press any key to stop'
read ans

docker rm -f $CONTAINER

rm ../.env
