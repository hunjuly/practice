import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_KEY } from './public.metadata'

// UserGuard는 인증 방식에 따라 달라진다.
// SessionGuard를 상속하면 local/session이다.
// JwtAuthGuard를 상속하면 local/JWT 방식이다.
// type UserGuard = SessionGuard 이런 식으로는 사용 할 수 없다.
@Injectable()
export class UserGuard implements CanActivate {
    constructor(protected reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            return true
        }

        return context.switchToHttp().getRequest().isAuthenticated()
    }
}

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
