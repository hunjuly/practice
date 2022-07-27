import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { entityToDto, ApiPaginatedResponse, Pagination, PageQuery } from 'src/common'
import { Public } from 'src/auth'
import { UsersService } from './users.service'
import { UpdateUserDto, CreateUserDto } from './domain'
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
    async create(@Body() dto: CreateUserDto) {
        const user = await this.service.create(dto)

        return ResponseUserDto.create(user)
    }

    @Get()
    @ApiPaginatedResponse(ResponseUserDto)
    async findAll(@PageQuery() page: Pagination) {
        const found = await this.service.findAll(page)

        const items = entityToDto(found.items, ResponseUserDto.create)

        return { ...found, items }
    }

    @Get(':id')
    @ApiOkResponse({ type: ResponseUserDto })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.service.get(id)

        return ResponseUserDto.create(user)
    }

    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
        return this.service.update(id, dto)
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.remove(id)
    }
}
