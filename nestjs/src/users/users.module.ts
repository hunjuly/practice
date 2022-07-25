import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/User'
import { AuthModule } from 'src/auth/auth.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
