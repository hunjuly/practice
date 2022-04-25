import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
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
        const res = await this.repository.findOne({ where: { email: createUserDto.email } })

        if (res) throw new ConflictException()

        const value = new User()
        value.email = createUserDto.email

        const user = await this.repository.save(value)

        await this.authService.createAccount(user, createUserDto.password)

        return user
    }

    async get(userId: string) {
        const res = await this.repository.findOne(userId)

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async findAll() {
        const files = await this.fileService.findAll()

        return this.repository.find()
    }

    async findByEmail(email: string) {
        const res = await this.repository.findOne({ where: { email } })

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async remove(userId: string) {
        const user = await this.get(userId)

        await this.authService.removeAccount(user)

        const res = await this.repository.delete(user.id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async update(userId: string, updateUserDto: UpdateUserDto) {
        const res = await this.repository.update(userId, updateUserDto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
