import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

    @Public()
    @Get()
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
