import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './public'
import { AuthGuard } from '@nestjs/passport'

class SessionGuard implements CanActivate {
    constructor(protected reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        return context.switchToHttp().getRequest().isAuthenticated()
    }
}

class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(protected reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context)
    }
}

// UserGuard는 인증 방식에 따라 달라진다.
// SessionGuard를 상속하면 local/session이다.
// JwtAuthGuard를 상속하면 local/JWT 방식이다.
// type UserGuard = SessionGuard 이런 식으로는 사용 할 수 없다.
@Injectable()
export class UserGuard extends SessionGuard {
    constructor(protected reflector: Reflector) {
        console.log('------------------1')
        super(reflector)
    }

    canActivate(context: ExecutionContext) {
        console.log('------------------2')
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
