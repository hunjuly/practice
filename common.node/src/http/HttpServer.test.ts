import { HttpRequest, HttpServer, HttpRouter, HttpTransaction, StatusCode } from '.'

test('HttpServer', async () => {
    let app: HttpServer | undefined

    try {
        const port = 9988

        const router = HttpRouter.create('')

        router.add('get', '/', (tx: HttpTransaction): void => {
            tx.reply(StatusCode.Ok)
        })

        const option = { logger: undefined, staticFolders: undefined }

        app = HttpServer.create([router], option)

        await app.start(port)

        const res = await HttpRequest.get(`http://localhost:${port}/`)

        expect(res.status).toEqual(StatusCode.Ok)
    } finally {
        if (app) await app.stop()
    }
})
