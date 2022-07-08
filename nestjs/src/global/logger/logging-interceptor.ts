import { Logger } from '@nestjs/common'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const now = Date.now()

        const request = context.switchToHttp().getRequest()

        const body = JSON.stringify(request.body)

        const response = context.switchToHttp().getResponse()

        const message = `${request.method}, ${request.url}, body: ${body}, status: ${response.statusCode}  ${
            Date.now() - now
        }ms`

        Logger.log('Success', request.method, request.url, response.statusCode, response.body)

        return next.handle().pipe(tap(() => Logger.log(message)))
    }
}
