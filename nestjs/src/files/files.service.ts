import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateFileDto } from './dto/update-file.dto'
import { CreateFileDto } from './dto/create-file.dto'
import { File } from 'src/typeorm/entity/File'

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File)
        private repository: Repository<File>
    ) {}

    // 이거 아니다. controller에서 채우게 해야 한다.
    updateFile(file: File) {
        file.downloadUrl = 'downloadUrl update'

        return file
    }

    async create(dto: CreateFileDto) {
        const file = new File()
        file.originalName = dto.originalName
        file.mimeType = dto.mimeType
        file.size = dto.size
        file.category = dto.fieldName

        const newFile = await this.repository.save(file)

        return this.updateFile(newFile)
    }

    async findAll() {
        const files = await this.repository.find()

        for (const file of files) {
            this.updateFile(file)
        }

        return files
    }

    async findOne(id: string) {
        const file = await this.repository.findOneBy({ id })

        if (file === undefined) throw new NotFoundException()

        return this.updateFile(file)
    }

    async update(id: string, updateFileDto: UpdateFileDto) {
        return `This action updates a #${id} file`
    }

    async remove(id: string) {
        const res = await this.repository.delete(id)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
