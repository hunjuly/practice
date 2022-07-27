import { Controller, Delete, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { LocalAuthGuard, Public } from 'src/authentication'

import { LoginUserDto } from './dto/login-user.dto'

@Controller('auth')
export class AuthController {
    constructor() {}

    @Post()
    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginUserDto })
    login(@Request() req) {
        return { id: req.user.id, email: req.user.email }
    }

    @Public()
    @Delete()
    async logout(@Request() req) {
        await req.logout((err) => {
            if (err) {
                Logger.error(err)
            }
        })

        return {}
    }
}
