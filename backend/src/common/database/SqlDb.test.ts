import { Docker, utils } from '..'
import { SqlDb } from '.'

describe('Mysql', () => {
    let db: SqlDb | undefined
    let container: Docker | undefined

    beforeAll(async () => {
        container = await Docker.create({
            Image: 'mysql:8',
            Env: ['MYSQL_ROOT_PASSWORD=adminpw'],
            HostConfig: { Binds: [`performance-testdb:/var/lib/mysql`] }
        })

        await container.start()

        if (await container.waitLog('port: 3306', 60)) {
            try {
                await container.exec([
                    'mysql',
                    '-padminpw',
                    '-e',
                    'drop database if exists db1;create database db1;'
                ])

                const info = await container.info()

                db = SqlDb.create({
                    host: info.NetworkSettings.IPAddress,
                    port: 3306,
                    user: 'root',
                    password: 'adminpw',
                    database: 'db1'
                })

                await utils.sleep(1000)
            } catch (error) {
                console.log(error)
            }
        }
    }, 60 * 1000)

    afterAll(async () => {
        if (db) {
            await db.close()
        }

        if (container) {
            await container.stop()
            await container.remove()
        }
    })

    test('command', async () => {
        if (!db) return

        const stmt =
            'CREATE TABLE table1 (' +
            'id INT AUTO_INCREMENT, ' +
            'name VARCHAR(64), ' +
            'age INT, ' +
            'create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
            'PRIMARY KEY (id))'

        await db.command(stmt)
    })

    test('insert', async () => {
        if (!db) return

        const values = [
            ['name2', 10],
            ['한글2', 20]
        ]

        const log = await db.insert('INSERT INTO table1 (name, age) VALUES ?', [values])
        console.log(log)
    })

    test('query', async () => {
        if (!db) return

        const res = await db.query('select * from table1')
        console.log(res)
        expect(res.length).toEqual(2)
    })
})
