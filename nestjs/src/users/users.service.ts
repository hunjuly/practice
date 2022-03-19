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

    findAll(): Promise<User[]> {
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        // throw new ForbiddenException('message', 'description')
        // return [{ email: 'test@gmail.com', self: '/users/12345' }]

        return this.usersRepository.find()
    }

    findOne(id: string): Promise<User> {
        // return { email: 'test@gmail.com', self: '/users/12345' }
        return this.usersRepository.findOne(id)
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id)
    }

    async create(createUserDto: CreateUserDto) {
        const value = {
            // id: 1234,
            firstName: 'string',
            lastName: 'string',
            isActive: false,
            photos: []
        }

        await this.usersRepository.create(value)
        // 201 Container created successfully
        // 400 bad parameter
        // 404 no such image
        // 409 conflict
        // 500 server error

        // {
        // "Id": "e90e34656806",
        // "Warnings": [ ]
        // }

        return { self: '/users/12345' }
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return { email: 'test@gmail.com', self: '/users/12345' }
    }
}
