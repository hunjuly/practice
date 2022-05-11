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
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { ApiPaginatedResponse, Pagination, PageQuery } from 'src/common/pagination'
import { Public } from 'src/auth/public'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { ResponseUserDto } from './dto/response-user.dto'

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    /**
     * 사용자 생성
     */
    @Post()
    @Public()
    @ApiCreatedResponse({ type: ResponseUserDto })
    async create(@Body() createUserDto: CreateUserDto) {
        const item = await this.service.create(createUserDto)

        return ResponseUserDto.create(item)
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
    @ApiPaginatedResponse(ResponseUserDto)
    async findAll(@PageQuery() page: Pagination) {
        const result = await this.service.findAll(page)

        const dtoArray = new Array<ResponseUserDto>()

        result.items.map((item) => dtoArray.push(ResponseUserDto.create(item)))

        return { ...result, items: dtoArray }
    }

    @Get(':id')
    @ApiOkResponse({ type: ResponseUserDto })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const item = await this.service.get(id)

        return ResponseUserDto.create(item)
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
