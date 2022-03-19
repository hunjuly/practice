import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Injectable, CanActivate, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!roles) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.user

        // return matchRoles(roles, user.roles)
        return false
    }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...')

        const now = Date.now()

        return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
    }
}

@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Post()
    // @Roles('admin')
    // create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    //     console.log(createUserDto)
    //     return this.usersService.create(createUserDto)
    // }
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto)
        return this.usersService.create(createUserDto)
    }

    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    //findOne(@Param('id', ParseIntPipe) id: number) {
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
