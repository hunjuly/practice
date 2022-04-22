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

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    @Public()
    create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.service.create(createUserDto)
    }

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @Redirect()
    login(@Request() req) {
        return { url: `/users/${req.user.id}` }
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
