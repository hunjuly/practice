import compression from 'compression'
import errorHandler from 'errorhandler'
import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Server, createServer } from 'http'
import { HttpRouter } from './'

export class HttpServer {
    public static create(
        routers: HttpRouter[],
        staticFiles: { prefix: string; path: string }[] = []
    ): HttpServer {
        const app = express()
        app.use(cors())
        app.use(compression())
        app.use(errorHandler())
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))

        this.enableLogging(app)

        for (const file of staticFiles) {
            app.use(file.prefix, express.static(file.path))
        }

        for (const router of routers) {
            app.use(router.namespace, router.handle)
        }

        const server = createServer(app)

        return new HttpServer(server)
    }

    private static enableLogging(app: Express) {
        const mode: 'combined' | 'common' | 'dev' | 'short' | 'tiny' = 'dev'

        app.use(morgan(mode))
    }

    private readonly server: Server

    private constructor(server: Server) {
        this.server = server
    }

    public start(port: number): void {
        this.server.on('error', (err?: NodeJS.ErrnoException) => {
            if (typeof err !== 'undefined') {
                if (err.syscall !== 'listen') {
                    throw err
                }

                switch (err.code) {
                    case 'EACCES':
                        error(`Port ${port} requires elevated privileges`)
                    // eslint-disable-next-line no-fallthrough
                    case 'EADDRINUSE':
                        error(`Port ${port} is already in use!`)
                    // eslint-disable-next-line no-fallthrough
                    default:
                        error(err.message)
                }
            }
        })

        this.server.listen(port, () => {
            console.log('Listening...')
        })
    }

    public stop(): void {
        if (this.server.listening) {
            this.server.close()
        }
    }
}
