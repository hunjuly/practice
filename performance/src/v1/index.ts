import { SqlDb } from 'common'
import { createSqlDb } from '../environment'
import { Repository } from './repository'
import * as router from './router'
import * as fixture from './fixture'

export function getRouter(sqlDb: SqlDb) {
    const repository = Repository.create(sqlDb)

    return router.create(repository)
}

export async function install() {
    const db = createSqlDb()

    await fixture.install(db)

    await db.close()
}

export * from './repository'
export * from './fixture'
