import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PhotosModule } from './photos/photos.module'
import { getOption } from './typeorm'

@Module({
    imports: [UsersModule, TypeOrmModule.forRoot(getOption()), PhotosModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
