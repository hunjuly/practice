import { HttpServer, HttpRequest } from '../http'
import * as routes from '.'

describe('routes', () => {
    const port = 5678
    const host = `http://localhost:${port}`
    const routers = [routes.default_({ name: '', version: '' })]
    const server = HttpServer.create(routers)

    beforeAll(() => {
        server.start(port)
    })

    afterAll(() => {
        server.stop()
    })

    test('정의한 api를 호출', async () => {
        const res = await HttpRequest.get(`${host}`)

        expect(res.status.code).toEqual(200)
    })
})