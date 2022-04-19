import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { FilesModule } from 'src/files/files.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [TypeOrmModule.forFeature([User]), FilesModule, AuthModule],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
