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

    test('api를 호출', async () => {
        const res = await HttpRequest.get(`${host}`)

        expect(res.status.code).toEqual(200)
    })

    test('좌석 선점', async () => {
        const res = await HttpRequest.put(`${host}/seats`)

        expect(res.status.code).toEqual(200)
    })
})
