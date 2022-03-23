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
