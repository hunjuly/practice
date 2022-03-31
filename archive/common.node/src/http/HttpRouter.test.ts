import { HttpServer, HttpRouter, HttpTransaction, StatusCode, HttpRequest, ResponseMessage } from '.'

describe('HttpRouter', () => {
    async function getResponse(router: HttpRouter, query: string): Promise<ResponseMessage> {
        const port = 8899

        const app = HttpServer.create([router])
        await app.start(port)

        const res = await HttpRequest.get(`http://localhost:${port}/${query}`)

        await app.stop()

        return res
    }

    test('response body', async () => {
        const body = { item: 'test body' }

        const router = HttpRouter.create('')

        router.add('get', '/', (tx: HttpTransaction): void => {
            tx.replyJson(StatusCode.Ok, body)
        })

        const res = await getResponse(router, '')

        expect(res.json()).toEqual(body)
    })

    test('response header', async () => {
        const headers = [{ name: 'test', value: 'header Val' }]

        const router = HttpRouter.create('')

        router.add('get', '/', (tx: HttpTransaction): void => {
            tx.reply(StatusCode.Ok, headers)
        })

        const res = await getResponse(router, '')

        expect(res.status).toEqual(StatusCode.Ok)
    })

    test('request query', async () => {
        const router = HttpRouter.create('')

        let values: string[] = []

        router.add('get', '/', (tx: HttpTransaction): void => {
            values = tx.query('items') as string[]

            tx.reply(StatusCode.Ok)
        })

        await getResponse(router, '?items=(a,b,3)&number=123')

        expect(values).toEqual(['a', 'b', '3'])
    })
})
