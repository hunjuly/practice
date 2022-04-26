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
import { Public } from 'src/auth/public'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath, PickType } from '@nestjs/swagger'
import { User } from './entities/user.entity'

export class PaginatedDto<TData> {
    @ApiProperty()
    total: number

    @ApiProperty()
    limit: number

    @ApiProperty()
    offset: number

    results: TData[]
}

export class UserDto extends PickType(User, [
    'id',
    'email',
    'isActive',
    'role',
    'createDate',
    'updateDate'
] as const) {
    link: string
}

@Controller('users')
@ApiExtraModels(PaginatedDto, UserDto)
export class UsersController {
    constructor(private readonly service: UsersService) {}

    /**
     * A list of user's roles?
     */
    @Post()
    @Public()
    create(@Body() createUserDto: CreateUserDto) {
        return this.service.create(createUserDto)
    }

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
    @Public()
    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(PaginatedDto) },
                {
                    properties: {
                        results: {
                            type: 'array',
                            items: { $ref: getSchemaPath(UserDto) }
                        }
                    }
                }
            ]
        }
    })
    // @ApiOkResponse({
    //     description: 'The record has been successfully created.',
    //     type: UserDto
    // })
    findAll() {
        const values = [
            {
                id: '4dc4db1b-d28f-48a8-8860-45f6485e91b1',
                email: 'test@mail.com',
                isActive: true,
                role: 'user',
                createDate: new Date('2022-04-26T07:12:57.000Z'),
                updateDate: new Date('2022-04-26T07:12:57.000Z'),
                deleteDate: null,
                version: 1
            }
        ]

        const results = new Array<UserDto>()

        values.map(({ deleteDate, version, role, ...dto }) => {
            results.push({ ...dto, link: '', role: 'abcd' })
        })

        return {
            total: 1999,
            limit: 10,
            offset: 3,
            results
        }
        // return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.get(id)
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.service.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.remove(id)
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
