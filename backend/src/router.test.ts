import { HttpServer, HttpRequest, StatusCode } from 'common'
import * as router from './router'

describe('routes', () => {
    const port = 5678
    const host = `http://localhost:${port}`

    let server: HttpServer | undefined

    beforeAll(async () => {
        const routers = [router.create({ name: '', version: '' })]
        server = HttpServer.create(routers)

        await server.start(port)
    })

    afterAll(async () => {
        if (server) await server.stop()
    })

    test('api를 호출', async () => {
        const res = await HttpRequest.get(`${host}`)

        expect(res.status).toEqual(StatusCode.Ok)
    })

    test('좌석 선점', async () => {
        const res = await HttpRequest.put(`${host}/seats`, {})

        expect(res.status).toEqual(StatusCode.Ok)
    })
})
