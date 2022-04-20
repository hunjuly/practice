import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { FilesModule } from 'src/files/files.module'
import { AuthModule } from 'src/auth/auth.module'
import { LocalStrategy } from './local.strategy'

@Module({
    imports: [TypeOrmModule.forFeature([User]), FilesModule, forwardRef(() => AuthModule)],
    providers: [UsersService, LocalStrategy],
    controllers: [UsersController]
})
export class UsersModule {}
