#! /bin/sh
set -e
cd "$(dirname "$0")"

MYSQL_CONTAINER="$(basename $WORKSPACE_ROOT).mysql"
REDIS_CONTAINER="$(basename $WORKSPACE_ROOT).redis"

TYPEORM_PASSWORD='password'

mysql() (
    CONTAINER=$MYSQL_CONTAINER

    TYPEORM_TYPE='mysql'
    TYPEORM_DATABASE='test'
    TYPEORM_HOST=$CONTAINER
    TYPEORM_PORT='3306'
    TYPEORM_USERNAME='root'

    docker rm -f ${CONTAINER}
    docker volume rm -f ${CONTAINER}

    docker run \
        --platform linux/amd64 \
        -d --name ${CONTAINER} --network vscode \
        -p ${TYPEORM_PORT}:${TYPEORM_PORT} \
        -e MYSQL_ROOT_PASSWORD=${TYPEORM_PASSWORD} \
        --mount source="${CONTAINER}",target=/var/lib/mysql,type=volume \
        mysql

    i=0
    while [ $i -lt 60 ]; do
        set +e
        found=$(docker logs ${CONTAINER} 2>&1 | grep -c "socket: '/var/run/mysqld/mysqld.sock'  port: ${TYPEORM_PORT}")
        set -e

        if [ $found -gt 0 ]; then
            docker exec ${CONTAINER} mysql -p$TYPEORM_PASSWORD -e "drop database if exists ${TYPEORM_DATABASE};create database ${TYPEORM_DATABASE};"

            echo "TYPEORM_TYPE=$TYPEORM_TYPE" >>../.env
            echo "TYPEORM_DATABASE=$TYPEORM_DATABASE" >>../.env
            echo "TYPEORM_HOST=$TYPEORM_HOST" >>../.env
            echo "TYPEORM_PORT=$TYPEORM_PORT" >>../.env
            echo "TYPEORM_USERNAME=$TYPEORM_USERNAME" >>../.env
            echo "TYPEORM_PASSWORD=$TYPEORM_PASSWORD" >>../.env
            echo "TYPEORM_ENABLE_SYNC=true" >>../.env

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
)

redis() (
    CONTAINER=$REDIS_CONTAINER

    REDIS_HOST=$CONTAINER
    REDIS_PORT='6379'

    docker rm -f ${CONTAINER}
    docker volume rm -f ${CONTAINER}

    docker run \
        -d --name ${CONTAINER} --network vscode \
        --mount source="${CONTAINER}",target=/data,type=volume \
        redis

    sleep 2s

    found=$(docker logs ${CONTAINER} 2>&1 | grep -c "Ready to accept connections")

    if [ $found -gt 0 ]; then
        echo "REDIS_HOST=$REDIS_HOST" >>../.env
        echo "REDIS_PORT=$REDIS_PORT" >>../.env

        echo 'redis ready.'
    else
        echo 'redis booting failed.'
        docker logs ${CONTAINER}
        exit 1
    fi
)

redis
mysql

echo ""
echo "docker exec -it $MYSQL_CONTAINER mysql -p$TYPEORM_PASSWORD"
echo "docker run --rm -it --network vscode redis redis-cli -h $REDIS_CONTAINER"
echo "keys *"
echo "get (key)"
echo ""
echo 'press any key to stop'
read ans

docker rm -f $MYSQL_CONTAINER $REDIS_CONTAINER
docker volume rm -f $MYSQL_CONTAINER $REDIS_CONTAINER
rm ../.env
