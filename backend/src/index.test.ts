import { HttpRequest } from 'common'
import { PackageInfo } from 'routes'
import { close, port, starting } from '.'

describe('routes', () => {
    const host = `http://localhost:${port()}`

    beforeAll(async () => {
        await starting()
    })

    afterAll(async () => {
        await close()
    })

    test('service info', async () => {
        const res = await HttpRequest.get(`${host}`)
        const body = res.json() as PackageInfo

        expect(body.name).toEqual('backend')
    })
})
