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
    UseGuards
} from '@nestjs/common'
import { Public, SessionGuard } from 'src/auth/jwt-auth.guard'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Public()
    @Post()
    create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.service.create(createUserDto)
    }

    // @UseGuards(SessionGuard)
    @Get()
    findAll() {
        return this.service.findAll()
    }

    @Public()
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

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        return this.service.login(req.user, req.session)
    }
}
