import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { Authentication } from './domain/authentication.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Authentication])],
    providers: [AuthService, AuthRepository],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
