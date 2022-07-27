import { DataSource } from 'typeorm'
import { createOptions } from './data-source'
// migrations
import { mig1658604911087 } from './migrations/1658604911087-mig'

export * from './orm.module'

const migrations = [mig1658604911087]

const option = createOptions()

export const AppDataSource = new DataSource({ ...option, migrations })
