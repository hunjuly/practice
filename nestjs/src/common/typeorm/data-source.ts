import { exit } from 'process'
import 'dotenv/config'
import 'reflect-metadata'
import { DataSourceOptions, Logger } from 'typeorm'

import { User } from 'src/users/domain/entities'
import { Authentication } from 'src/auth/domain/authentication.entity'
import { File } from 'src/files/entities/file.entity'

const entities = [User, Authentication, File]
const subscribers = []

export function createOptions(logger?: Logger): DataSourceOptions {
    const synchronize = getString('TYPEORM_ENABLE_SYNC') === 'true'
    const type = getString('TYPEORM_TYPE') as DatabaseType

    checkProduction(synchronize, type)

    const common = { type, synchronize, logger, entities, subscribers }

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

    if (!value) {
        console.log(`${key} is undefined.`)
        exit(1)
    }

    return value
}

function getNumber(key: string): number {
    const value = getString(key)

    return parseInt(value)
}
