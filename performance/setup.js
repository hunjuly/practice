const { Shell, SqlContainer, File } = require('common')

const SERVICE_PORT = '4000'
const password = 'adminpw'
const dbName = 'performance'

async function start() {
    const container = new SqlContainer()

    await container.start(dbName, password)
    const ipaddr = await container.getIpaddr()

    const data = `SERVICE_PORT='${SERVICE_PORT}'
        DB_HOST='${ipaddr}'
        DB_PORT='3306'
        DB_USER='root'
        DB_PASSWORD='${password}'
        DB_NAME='${dbName}'
        `
    File.write('.env', data)

    console.log('DB prepared.')
}

async function stop() {
    await Shell.exec(`docker rm -f ${dbName}`)
    await Shell.exec(`docker volume rm -f ${dbName}`)
}

if (process.argv.length < 3) {
    console.log('error) node start.js start/stop')
} else if ('start' === process.argv[2]) {
    void start()
} else if ('stop' === process.argv[2]) {
    void stop()
} else {
    console.log('error) node start.js start/stop')
}
