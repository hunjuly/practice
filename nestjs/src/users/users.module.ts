import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './domain'
import { AuthModule } from 'src/auth/auth.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
