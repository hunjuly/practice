import { Request, Response } from 'express'
import { Base64 } from '../'
import { StatusCode } from '.'

declare global {
    type HttpQuery = { [key: string]: string }
}

type HttpHeader = {
    name: string
    value: number | string | ReadonlyArray<string>
}

export class HttpTransaction {
    public static create(req: Request, res: Response): HttpTransaction {
        return new HttpTransaction(req, res)
    }

    private constructor(req: Request, res: Response) {
        this.req = req
        this.res = res
    }

    private readonly req: Request
    private readonly res: Response

    public clientIp(): string {
        return this.req.ip
    }

    public text(): string {
        return JSON.stringify(this.body())
    }

    public body(): unknown {
        return this.req.body as unknown
    }

    public query(name: string): string | string[] | undefined {
        const value = this.req.query[name] as string

        if (value === undefined) {
            return undefined
        }

        if (2 <= value.length) {
            if (value.charAt(0) === '(' && ')' === value.slice(-1)) {
                return value.slice(1, -1).split(',')
            }
        }

        return value
    }

    public param(name: string): string {
        return this.req.params[name]
    }

    public method(): string {
        return this.req.method
    }

    public path(): string {
        return this.req.path
    }

    private setHeaders(headers?: HttpHeader[]) {
        if (headers) {
            for (const header of headers ?? []) {
                this.res.setHeader(header.name, header.value)
            }
        }
    }

    public replyFile(file: string, headers?: HttpHeader[]): void {
        this.setHeaders(headers)

        this.res.status(StatusCode.Ok).download(file)
    }

    public replyBuffer(status: StatusCode, body: Buffer, headers?: HttpHeader[]): void {
        this.setHeaders(headers)

        const contents = Base64.encode(body)

        this.res.status(status).json({ contents: contents })
    }

    public replyJson(status: StatusCode, body: unknown, headers?: HttpHeader[]): void {
        this.setHeaders(headers)

        this.res.status(status).json(body)
    }

    public reply(status: StatusCode, headers?: HttpHeader[]): void {
        this.setHeaders(headers)

        this.res.status(status).end()
    }
}
