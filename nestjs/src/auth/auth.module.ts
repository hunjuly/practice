import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Authentication } from 'typeorm/entity/Authentication'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Authentication])],
    providers: [AuthService, AuthRepository],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
