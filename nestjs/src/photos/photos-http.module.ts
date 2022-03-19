import { Module } from '@nestjs/common'
import { PhotosModule } from './photos.module'
import { PhotosService } from './photos.service'
import { PhotosController } from './photos.controller'

@Module({
    imports: [PhotosModule],
    providers: [PhotosService],
    controllers: [PhotosController]
})
export class PhotoHttpModule {}
