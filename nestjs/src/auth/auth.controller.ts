import { Controller, Request, Post, Delete, UseGuards } from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { Public } from 'src/global/auth'
import { LocalAuthGuard } from 'src/global/auth'
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

    @Delete()
    async logout(@Request() req) {
        await req.logOut()

        return {}
    }
}
