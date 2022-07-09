import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Authentication } from './domain/auth.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Authentication])],
    providers: [AuthService, AuthRepository],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
