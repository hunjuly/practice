#! /bin/sh
mysql() (
    docker run \
        --platform linux/amd64 \
        -d --name ${MYSQL_CONTAINER} --network vscode \
        -p ${TYPEORM_PORT}:${TYPEORM_PORT} \
        -e MYSQL_ROOT_PASSWORD=${TYPEORM_PASSWORD} \
        --mount source="${MYSQL_CONTAINER}",target=/var/lib/mysql,type=volume \
        mysql

    i=0
    while [ $i -lt 60 ]; do
        set +e
        found=$(docker logs ${MYSQL_CONTAINER} 2>&1 | grep -c "socket: '/var/run/mysqld/mysqld.sock'  port: ${TYPEORM_PORT}")
        set -e

        if [ $found -gt 0 ]; then
            docker exec ${MYSQL_CONTAINER} mysql -p$TYPEORM_PASSWORD -e "drop database if exists ${TYPEORM_DATABASE};create database ${TYPEORM_DATABASE};"

            echo 'mysql booting success.('$i's)'
            return 0
        else
            echo "wait for booting...$i"

            i=$(($i + 1))
            sleep 1s
        fi
    done

    echo 'mysql booting failed.'
    docker logs ${MYSQL_CONTAINER}
    return 1
)

redis() (
    docker run \
        -d --name ${REDIS_CONTAINER} --network vscode \
        -p ${REDIS_PORT}:${REDIS_PORT} \
        --mount source="${REDIS_CONTAINER}",target=/data,type=volume \
        redis

    sleep 2s

    found=$(docker logs ${REDIS_CONTAINER} 2>&1 | grep -c "Ready to accept connections")

    if [ $found -gt 0 ]; then
        echo 'redis ready.'
    else
        echo 'redis booting failed.'
        docker logs ${REDIS_CONTAINER}
        exit 1
    fi
)

clear() (
    docker rm -f $MYSQL_CONTAINER $REDIS_CONTAINER
    docker volume rm -f $MYSQL_CONTAINER $REDIS_CONTAINER

    rm -f ../.env

    echo "LOG_STORE_PATH=./logs" >>../.env
    mkdir -p ../logs
    chmod 777 ../logs
)

docker_mode() (
    clear

    TYPEORM_TYPE='mysql'
    TYPEORM_DATABASE='test'
    TYPEORM_HOST=$MYSQL_CONTAINER
    TYPEORM_PORT='3306'
    TYPEORM_USERNAME='root'
    TYPEORM_PASSWORD='password'

    mysql

    REDIS_HOST=$REDIS_CONTAINER
    REDIS_PORT='6379'

    redis

    echo "TYPEORM_TYPE=$TYPEORM_TYPE" >>../.env
    echo "TYPEORM_DATABASE=$TYPEORM_DATABASE" >>../.env
    echo "TYPEORM_HOST=$TYPEORM_HOST" >>../.env
    echo "TYPEORM_PORT=$TYPEORM_PORT" >>../.env
    echo "TYPEORM_USERNAME=$TYPEORM_USERNAME" >>../.env
    echo "TYPEORM_PASSWORD=$TYPEORM_PASSWORD" >>../.env
    echo "TYPEORM_ENABLE_SYNC=true" >>../.env
    echo ""
    echo "SESSION_TYPE=redis" >>../.env
    echo "REDIS_HOST=$REDIS_HOST" >>../.env
    echo "REDIS_PORT=$REDIS_PORT" >>../.env

    echo ""
    echo "docker exec -it $MYSQL_CONTAINER mysql -p$TYPEORM_PASSWORD"
    echo "docker run --rm -it --network vscode redis redis-cli -h $REDIS_CONTAINER"
    echo "keys *"
    echo "get (key)"
)

memory_mode() (
    clear

    echo "TYPEORM_TYPE=sqlite" >>../.env
    echo "TYPEORM_DATABASE=\":memory:\"" >>../.env
    echo "TYPEORM_ENABLE_SYNC=true" >>../.env
    echo ""
    echo "SESSION_TYPE=memory" >>../.env
)

MYSQL_CONTAINER="$(basename $WORKSPACE_ROOT).mysql"
REDIS_CONTAINER="$(basename $WORKSPACE_ROOT).redis"

set -e
cd "$(dirname "$0")"

if [ "$1" = "memory" ]; then
    memory_mode
elif [ "$1" = 'docker' ]; then
    docker_mode
else
    echo 'Usage:  sh bootup_infra.sh [memory, docker]'
    exit 1
fi
