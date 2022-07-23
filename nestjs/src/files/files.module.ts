import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from 'typeorm/entity/File'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {}
