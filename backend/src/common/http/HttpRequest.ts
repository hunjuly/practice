import { request, IncomingMessage, RequestOptions } from 'http'
import { URL } from 'url'
import { Readable, Writable, pipeline } from 'stream'
import { BufferReadStream, BufferWriteStream, NullStream } from 'common'

// "  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
// ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
// │                                              href                                              │
// ├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
// │ protocol │  │        auth         │          host          │           path            │ hash  │
// │          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
// │          │  │                     │    hostname     │ port │ pathname │     search     │       │
// │          │  │                     │                 │      │          ├─┬──────────────┤       │
// │          │  │                     │                 │      │          │ │    query     │       │
// │          │  │          │          │    hostname     │ port │          │                │       │
// │          │  │          │          ├─────────────────┴──────┤          │                │       │
// │ protocol │  │ username │ password │          host          │          │                │       │
// ├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
// │   origin    │                     │         origin         │ pathname │     search     │ hash  │
// ├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
// │                                              href                                              │
// └────────────────────────────────────────────────────────────────────────────────────────────────┘

class ResponseStatus {
    public readonly code: number
    public readonly contentType: string | undefined

    constructor(res: IncomingMessage) {
        this.code = res.statusCode ?? -1
        this.contentType = res.headers['content-type']
    }
}

export class ResponseMessage {
    public readonly status: number
    public readonly contentType: string | undefined

    private readonly body: Buffer

    constructor(status: ResponseStatus, body: Buffer) {
        this.status = status.code
        this.contentType = status.contentType
        this.body = body
    }

    public buffer(): Buffer {
        return this.body
    }

    public text(): string {
        return this.body.toString()
    }

    public json(): unknown {
        const str = this.text()

        return JSON.parse(str) as unknown
    }
}

export class HttpRequest {
    public static sendStream(
        opts: RequestOptions,
        reader: Readable,
        writer: Writable
    ): Promise<ResponseStatus> {
        return new Promise((resolve, reject) => {
            const callback = (res: IncomingMessage) => {
                if (res.statusCode === undefined) {
                    error('unexpected error. res.statusCode is undefined.', reject)
                }

                const status = new ResponseStatus(res)
                const success = () => resolve(status)

                res.on('end', success).on('error', reject).pipe(writer)
            }

            const req = request(opts, callback).on('error', reject)

            pipeline(reader, req, (err: Error | null) => {
                if (err != null) {
                    reject(err)
                }
            })
        })
    }

    public static async sendBuffer(opts: RequestOptions, body?: unknown): Promise<ResponseMessage> {
        const reader = body === undefined ? NullStream.create() : BufferReadStream.fromObject(body)
        const writer = BufferWriteStream.create()

        const status = await this.sendStream(opts, reader, writer)

        return new ResponseMessage(status, writer.getBuffer())
    }

    public static get(href: string): Promise<ResponseMessage> {
        const opts = this.createOpts(href)
        opts.method = 'GET'

        return this.sendBuffer(opts)
    }

    public static post(href: string, body: unknown): Promise<ResponseMessage> {
        const opts = this.createOpts(href)
        opts.method = 'POST'
        opts.headers = { 'Content-Type': 'application/json' }

        return this.sendBuffer(opts, body)
    }

    public static put(href: string, body: unknown): Promise<ResponseMessage> {
        const opts = this.createOpts(href)
        opts.method = 'PUT'
        opts.headers = { 'Content-Type': 'application/json' }

        return this.sendBuffer(opts, body)
    }

    private static createOpts(href: string): RequestOptions {
        const parts = new URL(href)

        return {
            host: parts.hostname,
            port: parts.port,
            path: parts.pathname + parts.search,
            protocol: parts.protocol
        }
    }
}
