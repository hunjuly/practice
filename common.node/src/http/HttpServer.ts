import compression from 'compression'
import errorHandler from 'errorhandler'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Server, createServer } from 'http'
import { HttpRouter } from '.'

export type HttpServerOption = {
    logger?: 'combined' | 'common' | 'dev' | 'short' | 'tiny'
    statics?: { prefix: string; path: string }[]
}

export class HttpServer {
    public static create(routers: HttpRouter[], option?: HttpServerOption): HttpServer {
        const app = express()
        app.use(cors())
        app.use(compression())
        app.use(errorHandler())
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))

        if (option) {
            if (option.logger) app.use(morgan(option.logger))

            for (const item of option.statics ?? []) {
                app.use(item.prefix, express.static(item.path))
            }
        }

        for (const router of routers) {
            app.use(router.namespace, router.handle)
        }

        const server = createServer(app)

        return new HttpServer(server)
    }

    public readonly server: Server

    private constructor(server: Server) {
        this.server = server
    }

    public start(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.on('error', (err?: NodeJS.ErrnoException) => {
                if (typeof err !== 'undefined') {
                    if (err.syscall !== 'listen') {
                        reject(err)
                    }

                    switch (err.code) {
                        case 'EACCES':
                            reject(`Port ${port} requires elevated privileges`)
                        // eslint-disable-next-line no-fallthrough
                        case 'EADDRINUSE':
                            reject(`Port ${port} is already in use!`)
                        // eslint-disable-next-line no-fallthrough
                        default:
                            reject(err.message)
                    }
                }
            })

            this.server.listen(port, () => {
                console.log(`starting server, port=${port}`)

                resolve()
            })
        })
    }

    public stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.server.listening) {
                this.server.close((err?: Error) => {
                    if (err) reject(err)
                    else resolve()
                })
            } else {
                resolve()
            }
        })
    }
}
