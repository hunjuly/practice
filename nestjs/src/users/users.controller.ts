import {
    Controller,
    Request,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Redirect,
    ParseUUIDPipe
} from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiProperty, OmitType } from '@nestjs/swagger'
import { ApiPaginatedResponse, PageDto, PageQuery } from 'src/common/pagination'
import { Public } from 'src/auth/public'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { LoginUserDto } from './dto/login-user.dto'

class UserDto extends OmitType(User, ['auths', 'deleteDate'] as const) {
    @ApiProperty()
    url: string

    static from(user: User) {
        const { auths, deleteDate, ...value } = user

        const url = `/users/${value.id}`

        return { ...value, url }
    }
}

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    /**
     * 사용자 생성
     */
    @Post()
    @Public()
    @ApiCreatedResponse({ type: UserDto })
    async create(@Body() createUserDto: CreateUserDto) {
        const item = await this.service.create(createUserDto)

        return UserDto.from(item)
    }

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @Redirect('/users', 302)
    @ApiBody({ type: LoginUserDto })
    login(@Request() req) {
        return { url: `/users/${req.user.id}`, statusCode: 302 }
    }

    @Delete('logout')
    async logout(@Request() req) {
        await req.logOut()
    }

    @Get()
    @Public()
    @ApiPaginatedResponse(UserDto)
    async findAll(@PageQuery() page: PageDto) {
        const [items, count] = await this.service.findAll(page)

        const results = new Array<UserDto>()

        items.map((item) => results.push(UserDto.from(item)))

        return {
            total: count,
            limit: page.limit,
            offset: page.offset,
            results
        }
    }

    @Get(':id')
    @ApiOkResponse({ type: UserDto })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const item = await this.service.get(id)

        return UserDto.from(item)
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.service.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.remove(id)
    }
}
