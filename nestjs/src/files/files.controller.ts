import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from '@nestjs/common'
import { FilesService } from './files.service'
import { UpdateFileDto } from './dto/update-file.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { diskStorage } from 'multer'
import { utils, Path } from 'src/common'
import { CreateFileDto } from './dto/create-file.dto'
import { UserGuard } from 'src/auth/user.guard'

@Controller('files')
@UseGuards(UserGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('marketfile', {
            storage: diskStorage({
                destination: Path.tempdir(),
                filename: (req, file, callback) => callback(null, `${utils.uuid()}.dat`)
            })
        })
    )
    create(@Body() fields: CreateFileDto, @UploadedFile() file: Express.Multer.File) {
        const dto = {
            originalName: file.originalname,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size,
            fieldName: fields.fieldName
        }

        return this.filesService.create(dto)
    }

    @Get()
    findAll() {
        return this.filesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        return this.filesService.update(id, updateFileDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(id)
    }
}
