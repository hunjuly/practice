dbName=mysql

docker rm -f ${dbName}
docker volume rm -f ${dbName}

docker run -d --name mysql --network vscode \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=password \
    --mount source="${dbName}",target=/var/lib/mysql,type=volume \
    mysql

i=0

while [ $i -lt 30 ]; do
    found=$(docker logs mysql 2>&1 | grep -c "ready for connections. Version: '8.0.28'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306")

    if [ $found -gt 0 ]; then
        docker exec mysql mysql -ppassword -e 'drop database if exists test;create database test;'
        echo 'mysql booting success.('$i's)'
        exit 0
    else
        i=$(($i + 1))
        sleep 1s
    fi
done

echo 'mysql booting failed.'
exit 1
