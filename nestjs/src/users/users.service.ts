import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { FilesService } from 'src/files/files.service'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        private readonly service: FilesService
    ) {}

    async findAll() {
        const files = await this.service.findAll()

        return this.repository.find()
    }

    // async findOne(id: string) {
    //     const res = await this.repository.findOne(id)

    //     if (res === undefined) throw new NotFoundException()

    //     return res
    // }

    private readonly users = [
        {
            id: '1',
            email: 'john',
            password: 'changeme'
        },
        {
            id: '2',
            email: 'maria',
            password: 'guess'
        }
    ] as unknown as User[]

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find((user) => user.email === email)
    }

    async remove(id: string) {
        const res = await this.repository.delete(id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async create(createUserDto: CreateUserDto) {
        const user = new User()
        user.email = createUserDto.email
        // user.password = createUserDto.password

        return this.repository.save(user)
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const res = await this.repository.update(id, updateUserDto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
