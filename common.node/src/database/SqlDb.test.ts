import { utils } from '..'
import { SqlContainer } from '.'

describe('Mysql', () => {
    const container = new SqlContainer()

    beforeAll(async () => {
        await container.start('testDb', 'adminpw')
    }, 60 * 1000)

    afterAll(async () => {
        await container.stop()
    })

    test('command', async () => {
        const stmt = `CREATE TABLE table1 (
            id INT AUTO_INCREMENT,
            name VARCHAR(64),
            text LONGTEXT,
            age INT,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id))`

        await container.getDb().command(stmt)
    })

    test('insert', async () => {
        const longText = utils.createChunk(5 * 1024 * 1024)

        const values = [
            ['name2', 10, longText],
            ['한글2', 20, longText]
        ]

        const log = await container.getDb().insert('INSERT INTO table1 (name, age, text) VALUES ?', [values])
        console.log(log)
    })

    test('query', async () => {
        const res = await container.getDb().query('select id,name,text,UUID() from table1')

        expect(res.length).toEqual(2)
    })
})
