import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PhotosModule } from './photos/photos.module'
import { FilesModule } from './files/files.module'
import { createOrmModule } from './typeorm'
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [createOrmModule(), UsersModule, PhotosModule, FilesModule, AuthModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
