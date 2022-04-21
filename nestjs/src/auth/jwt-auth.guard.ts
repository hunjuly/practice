import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { SetMetadata } from '@nestjs/common'

const IS_PUBLIC_KEY = 'isPublic'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class SessionGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) {
            return true
        }
        return super.canActivate(context)
    }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) {
            return true
        }
        // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        //     context.getHandler(),
        //     context.getClass()
        // ])
        // if (isPublic) {
        //     return true
        // }

        return context.switchToHttp().getRequest().isAuthenticated()
    }
}
