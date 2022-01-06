import 'dotenv/config'
import { HttpServer, HttpServerOption, SqlDb } from 'common'
import { createSqlDb, port } from './infrastructure'
import * as v1 from './v1'

export class App {
    private http: HttpServer | undefined
    private sqlDb: SqlDb | undefined

    public async close(): Promise<void> {
        if (this.http) await this.http.stop()
        if (this.sqlDb) await this.sqlDb.close()
    }

    public async start(): Promise<void> {
        const sqlDb = createSqlDb()

        const routers = [v1.getRouter(sqlDb)]

        const option: HttpServerOption = { logger: 'tiny', statics: [{ prefix: '/', path: 'public' }] }

        const http = HttpServer.create(routers, option)

        await http.start(port())

        this.http = http
        this.sqlDb = sqlDb
    }
}
