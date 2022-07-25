import { DataSource } from 'typeorm'
import { createOptions } from 'src/common'

// migrations
import { mig1658604911087 } from './migrations/1658604911087-mig'

const migrations = [mig1658604911087]

const option = createOptions()

export const AppDataSource = new DataSource({ ...option, migrations })
