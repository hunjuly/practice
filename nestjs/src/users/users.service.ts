import { Injectable } from '@nestjs/common'
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

    findOne(id: string) {
        return this.usersRepository.findOne(id)
    }

    async remove(id: string) {
        await this.usersRepository.delete(id)
    }

    async create(createUserDto: CreateUserDto) {
        const user = new User()
        user.email = createUserDto.email
        user.password = createUserDto.password
        console.log(user)
        return this.usersRepository.save(user)
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return { email: 'test@gmail.com', self: '/users/12345' }
    }
}
