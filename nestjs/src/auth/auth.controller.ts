import { Controller, Request, Post, Delete, UseGuards, Redirect } from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { Public } from 'src/auth/public'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('auth')
export class AuthController {
    constructor() {}

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    // @Redirect('/users', 302)
    @ApiBody({ type: LoginUserDto })
    login() {
        // login(@Request() req) {
        // return { url: `/users/${req.user.id}`, statusCode: 302 }
    }

    @Delete('logout')
    async logout(@Request() req) {
        await req.logOut()
    }
}
