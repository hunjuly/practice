import { createPool, Pool, ResultSetHeader } from 'mysql2/promise'

export type CommandResult = { affectedRows: number }

export interface SqlDbCfg {
    host: string
    port: number
    user: string
    password: string
    database: string
}

export abstract class SqlDb {
    public static create(config: SqlDbCfg): SqlDb {
        const pool = createPool(config)

        return new MysqlImpl(pool)
    }

    public abstract close(): Promise<void>
    public abstract query(query: string): Promise<unknown[]>
    public abstract command(query: string): Promise<CommandResult>
    public abstract insert(query: string, values: unknown): Promise<CommandResult>
}

export class MysqlImpl implements SqlDb {
    private readonly pool: Pool

    public constructor(pool: Pool) {
        this.pool = pool
    }

    public close(): Promise<void> {
        return this.pool.end()
    }

    public async query(sql: string): Promise<unknown[]> {
        const conn = await this.pool.getConnection()

        try {
            return (await conn.query(sql))[0] as unknown[]
        } finally {
            if (conn) conn.release()
        }
    }

    public async command(sql: string): Promise<CommandResult> {
        const conn = await this.pool.getConnection()

        try {
            const res = await conn.query(sql)

            return res[0] as ResultSetHeader
        } finally {
            if (conn) conn.release()
        }
    }

    public async insert(query: string, values: unknown): Promise<CommandResult> {
        const conn = await this.pool.getConnection()

        try {
            await conn.beginTransaction()

            const res = await conn.query(query, values)

            await conn.commit()

            return res[0] as ResultSetHeader
        } catch (err) {
            await conn.rollback()

            error(err)
        }
    }
}
