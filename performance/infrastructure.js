const { Shell, SqlContainer, File } = require('common')

const SERVICE_PORT = '3000'
const password = 'adminpw'
const dbName = 'performance'

async function create() {
    const container = new SqlContainer()

    await container.start(dbName, password)
    const ipaddr = await container.getIpaddr()

    const data = `
SERVICE_PORT='${SERVICE_PORT}'
DB_HOST='${ipaddr}'
DB_PORT='3306'
DB_USER='root'
DB_PASSWORD='${password}'
DB_NAME='${dbName}'
`
    File.write('.env', data)

    console.log('DB prepared.')
}

async function clear() {
    await Shell.exec(`docker rm -f ${dbName}`)
    await Shell.exec(`docker volume rm -f ${dbName}`)
    await Shell.exec(`rm -f .env`)
}

if (3 <= process.argv.length && 'clear' === process.argv[2]) {
    void clear()
} else {
    void create()
}
