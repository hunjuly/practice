import { Logger } from '@nestjs/common'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const logger = new Logger('_')

        const now = Date.now()

        const request = context.switchToHttp().getRequest()
        const body = JSON.stringify(request.body)

        const message = `${request.url}, body: ${body}  ${Date.now() - now}ms`

        return next.handle().pipe(tap(() => logger.log(message)))
    }
}
