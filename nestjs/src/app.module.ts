import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PhotosModule } from './photos/photos.module'

const typeOrm = TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'mysql',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'test',
    autoLoadEntities: true,
    synchronize: true
})

@Module({
    imports: [UsersModule, typeOrm, PhotosModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
