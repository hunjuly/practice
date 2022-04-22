import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // super.canActivate() 하면 LocalStrategy.validate() 한다.
        // validate()의 리턴값({ id: user.id })을 request.user에 기록한다.
        const result = (await super.canActivate(context)) as boolean

        // serializeUser(request.user) 호출
        await super.logIn(context.switchToHttp().getRequest())

        return result
    }
}
