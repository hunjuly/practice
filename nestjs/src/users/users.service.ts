import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { FilesService } from 'src/files/files.service'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        private readonly fileService: FilesService,
        private readonly authService: AuthService
    ) {}

    async create(createUserDto: CreateUserDto) {
        const user = new User()
        user.email = createUserDto.email

        const newUser = await this.repository.save(user)

        await this.authService.createAccount(newUser.id, createUserDto.password)

        return newUser
    }

    async login(request: any) {
        const user = await this.findOne(request.email)

        return this.authService.login(user.id, request.password)
    }

    async findAll() {
        const files = await this.fileService.findAll()

        return this.repository.find()
    }

    async findOne(id: string) {
        const res = await this.repository.findOne(id)

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async remove(id: string) {
        const res = await this.repository.delete(id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const res = await this.repository.update(id, updateUserDto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
