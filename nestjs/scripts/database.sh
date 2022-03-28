#! /bin/sh
set -ex
cd "$(dirname "$0")"

mysql() {
    DATABASE_TYPE='mysql'
    DATABASE_DATABASE='test'
    DATABASE_HOST='mysql'
    DATABASE_PORT='3306'
    DATABASE_USERNAME='root'
    DATABASE_PASSWORD='password'

    CONTAINER=mysql

    docker rm -f ${CONTAINER}
    docker volume rm -f ${CONTAINER}

    # docker run -d --name ${CONTAINER} --network vscode \
    #     -p ${DATABASE_PORT}:${DATABASE_PORT} \
    #     -e MYSQL_ROOT_PASSWORD=${DATABASE_PASSWORD} \
    #     --mount source="${CONTAINER}",target=/var/lib/mysql,type=volume \
    #     mysql
    dbName=mysql
    docker run -d --name mysql --network vscode \
        -p 3306:3306 \
        -e MYSQL_ROOT_PASSWORD=password \
        --mount source="${dbName}",target=/var/lib/mysql,type=volume \
        mysql

    i=0
    while [ $i -lt 30 ]; do
        echo "DEBUG 0"
        # found=$(docker logs ${CONTAINER} 2>&1 | grep -c "socket: '/var/run/mysqld/mysqld.sock'  port: ${DATABASE_PORT}")
        found=$(docker logs mysql 2>&1 | grep -c "ready for connections. Version: '8.0.28'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306")

        echo "DEBUG 1"

        if [ $found -gt 0 ]; then
            echo "DEBUG 2"
            docker exec ${CONTAINER} mysql -p$DATABASE_PASSWORD -e "drop database if exists ${DATABASE_DATABASE};create database ${DATABASE_DATABASE};"
            echo 'mysql booting success.('$i's)'
            echo "DEBUG 3"
            return 0
        else
            echo "DEBUG 4"
            i=$(($i + 1))
            sleep 1s
        fi
        echo "DEBUG 5"

    done
    echo "DEBUG 6"

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

}

memory() {
    echo 'memory'
    # DATABASE_TYPE='sqlite'
    # DATABASE_DATABASE=':memory:'
}

if [ "$1" = "mysql" ]; then
    mysql
    writeEnv
else
    echo "default $1"
fi

# echo "abc" >"../.env"
# echo "efg" >>"../test.txt"
