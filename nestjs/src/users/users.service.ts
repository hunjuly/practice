import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    findAll() {
        return this.usersRepository.find()
    }

    async findOne(id: string) {
        const res = await this.usersRepository.findOne(id)

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async remove(id: string) {
        const res = await this.usersRepository.delete(id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async create(createUserDto: CreateUserDto) {
        const user = new User()
        user.email = createUserDto.email
        user.password = createUserDto.password

        return this.usersRepository.save(user)
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const res = await this.usersRepository.update(id, updateUserDto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
