import {
    Controller,
    Request,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UseGuards,
    Redirect
} from '@nestjs/common'
import { Public } from 'src/auth/public'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { ApiOperation, ApiProperty } from '@nestjs/swagger'

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    /**
     * @description
     * A list of user's roles
     * @example ['admin']
     */
    @Post()
    @Public()
    create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.service.create(createUserDto)
    }
    // @ApiOperation({ description: 'Create some resource' })

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @Redirect()
    login(@Request() req) {
        return { url: `/users/${req.user.id}` }
    }

    @Delete('logout')
    @Redirect()
    async logout(@Request() req) {
        await req.logOut()

        return { url: `/login` }
    }

    @Get()
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.get(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.service.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
