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
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { JwtAuthGuard, Public } from 'src/auth/jwt-auth.guard'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.service.create(createUserDto)
    }

    @Get()
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.service.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('auth/login')
    async login(@Request() req) {
        return this.service.login(req.user)
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
