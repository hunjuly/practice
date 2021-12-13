import { Docker, utils, SqlDb, Shell } from '../'

export class SqlContainer {
    private db: SqlDb | undefined
    private container: Docker | undefined

    public async stop() {
        if (this.db) {
            await this.db.close()
        }

        if (this.container) {
            await this.container.stop()
            await this.container.remove()
        }
    }

    public getDb(): SqlDb {
        if (this.db) return this.db

        error('this.db undef')
    }

    public async start(dbName: string, password: string) {
        await Shell.exec(`docker rm -f ${dbName}`)
        await Shell.exec(`docker volume rm -f ${dbName}`)

        this.container = await Docker.create({
            Image: 'mysql:8',
            name: dbName,
            Env: ['MYSQL_ROOT_PASSWORD=' + password],
            HostConfig: { Binds: [`${dbName}:/var/lib/mysql`] }
        })

        await this.container.start()

        const found = await this.container.waitLog(['port: 3306', '[ERROR]'], 60)

        if (found === 'port: 3306') {
            try {
                await this.container.exec([
                    'mysql',
                    `-p${password}`,
                    '-e',
                    `drop database if exists ${dbName};create database ${dbName};`
                ])

                const info = await this.container.info()

                this.db = SqlDb.create({
                    host: info.NetworkSettings.IPAddress,
                    port: 3306,
                    user: 'root',
                    password: password,
                    database: dbName
                })

                await utils.sleep(1000)
            } catch (error) {
                console.log(error)
            }
        } else if (found === '[ERROR]') {
            error('MySql 초기화 실패.')
        } else {
            error('timeout')
        }
    }
}
