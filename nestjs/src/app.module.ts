import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PhotosModule } from './photos/photos.module'
import { getOrmModule } from './typeorm'

@Module({
    imports: [UsersModule, getOrmModule(), PhotosModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
