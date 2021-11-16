import { SqlContainer } from '.'

describe('Mysql', () => {
    const container = new SqlContainer()

    beforeAll(async () => {
        await container.start('testdb')
    }, 60 * 1000)

    afterAll(async () => {
        await container.stop()
    })

    test('command', async () => {
        const stmt =
            'CREATE TABLE table1 (' +
            'id INT AUTO_INCREMENT, ' +
            'name VARCHAR(64), ' +
            'age INT, ' +
            'create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
            'PRIMARY KEY (id))'

        await container.getDb().command(stmt)
    })

    test('insert', async () => {
        const values = [
            ['name2', 10],
            ['한글2', 20]
        ]

        const log = await container.getDb().insert('INSERT INTO table1 (name, age) VALUES ?', [values])
        console.log(log)
    })

    test('query', async () => {
        const res = await container.getDb().query('select * from table1')

        expect(res.length).toEqual(2)
    })
})
