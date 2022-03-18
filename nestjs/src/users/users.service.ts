import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
    create(createUserDto: CreateUserDto) {
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

    findAll() {
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        throw new ForbiddenException('message', 'description')
        return [{ email: 'test@gmail.com', self: '/users/12345' }]
    }

    findOne(id: string) {
        return { email: 'test@gmail.com', self: '/users/12345' }
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return { email: 'test@gmail.com', self: '/users/12345' }
    }

    remove(id: string) {
        return 'The user was deleted successfully'
    }
}
