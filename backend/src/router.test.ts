import { HttpServer, HttpRequest, StatusCode, utils, SqlDb, CommandResult } from 'common'
import * as router from './router'

describe('routes', () => {
    const port = 5678
    const host = `http://localhost:${port}`

    let server: HttpServer | undefined

    beforeAll(async () => {
        const routers = [router.create(new SqlDbMock())]
        server = HttpServer.create(routers)

        await server.start(port)
    })

    afterAll(async () => {
        if (server) await server.stop()
    })

    test('좌석 선점', async () => {
        const res = await HttpRequest.put(`${host}/seats`, {})

        expect(res.status).toEqual(StatusCode.Ok)
    })
})

class SqlDbMock implements SqlDb {
    public async close(): Promise<void> {
        await utils.sleep(100)
    }
    public async query(_query: string): Promise<unknown[]> {
        await utils.sleep(100)
        return []
    }
    public async command(_query: string): Promise<CommandResult> {
        await utils.sleep(100)
        return { affectedRows: 1 }
    }
    public async insert(_query: string, _values: unknown): Promise<CommandResult> {
        await utils.sleep(100)
        return { affectedRows: 1 }
    }
}
