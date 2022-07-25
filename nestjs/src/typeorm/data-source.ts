import { exit } from 'process'
import 'dotenv/config'
import 'reflect-metadata'
import { DataSource, DataSourceOptions, Logger } from 'typeorm'

// entities
import { User } from './entity/User'
import { Authentication } from './entity/Authentication'
import { File } from './entity/File'

// migrations
import { mig1658604911087 } from './migration/1658604911087-mig'

const entities = [User, Authentication, File]
const migrations = [mig1658604911087]
const subscribers = []

export function createOptions(logger?: Logger): DataSourceOptions {
    const synchronize = getString('TYPEORM_ENABLE_SYNC') === 'true'
    const type = getString('TYPEORM_TYPE') as DatabaseType

    checkProduction(synchronize, type)

    const common = { type, synchronize, logger, entities, migrations, subscribers }

    if (common.type === 'sqlite') {
        console.log('using MEMORY DB.')

        const database = ':memory:'

        return { ...common, database }
    } else if (common.type === 'mysql') {
        const database = getString('TYPEORM_DATABASE')
        const host = getString('TYPEORM_HOST')
        const port = getNumber('TYPEORM_PORT')
        const username = getString('TYPEORM_USERNAME')
        const password = getString('TYPEORM_PASSWORD')

        return { ...common, database, host, port, username, password }
    }

    throw new Error(`unknown TYPEORM_TYPE(${common.type})`)
}

export const AppDataSource = new DataSource(createOptions())

type DatabaseType = 'mysql' | 'sqlite' | undefined

function checkProduction(synchronize: boolean, type: DatabaseType) {
    const nodeEnv = getString('NODE_ENV')

    if (nodeEnv === 'production') {
        if (synchronize) {
            console.log('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')
            exit(1)
        }

        if (type === 'sqlite') {
            console.log('Do not use Sqlite(memory) on production')
            exit(1)
        }
    }
}

function getString(key: string): string {
    const value = process.env[key]

    if (value === undefined) {
        console.log(`${key} is undefined.`)
        exit(1)
    }

    return value
}

function getNumber(key: string): number {
    const value = getString(key)

    return parseInt(value)
}
