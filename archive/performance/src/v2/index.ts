import { SqlDb } from 'common'
import { createSqlDb } from '../environment'
import { Repository } from './repository'
import { Service, ServiceTest } from './service'
import * as router from './router'
import * as fixture from './fixture'

export * from './fixture'
export * from './types'

export function getRouter(sqlDb: SqlDb) {
    const repository = Repository.create(sqlDb)
    const service = Service.create(repository)
    const test = ServiceTest.create(service)

    return router.create(service, test)
}

export async function install() {
    const db = createSqlDb()

    await fixture.install(db)

    await db.close()
}
