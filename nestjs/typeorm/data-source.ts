import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import { Authentication } from './entity/Authentication'
import { File } from './entity/File'
import { mig1658604911087 } from './migration/1658604911087-mig'

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'practice.mysql',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'test',
    synchronize: false,
    logging: false,
    entities: [User, Authentication, File],
    migrations: [mig1658604911087],
    subscribers: []
})
