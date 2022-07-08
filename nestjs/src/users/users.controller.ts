import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { ApiPaginatedResponse, Pagination, PageQuery } from 'src/common'
import { Public } from 'src/auth/public'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ResponseUserDto as UserDto } from './dto/user.dto'
import { entityToDto } from 'src/common'

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    /**
     * 사용자 생성
     */
    @Post()
    @Public()
    @ApiCreatedResponse({ type: UserDto })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.service.create(dto)

        return UserDto.create(user)
    }

    @Get()
    @Public()
    @ApiPaginatedResponse(UserDto)
    async findAll(@PageQuery() page: Pagination) {
        const found = await this.service.findAll(page)

        const items = entityToDto(found.items, UserDto.create)

        return { ...found, items }
    }

    @Get(':id')
    @ApiOkResponse({ type: UserDto })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.service.get(id)

        return UserDto.create(user)
    }

    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
        await this.service.update(id, dto)
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.service.remove(id)
    }
}
