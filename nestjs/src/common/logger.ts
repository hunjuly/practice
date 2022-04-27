import { Logger } from '@nestjs/common'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const logger = new Logger('_')

        const now = Date.now()

        const request = context.switchToHttp().getRequest()

        return next.handle().pipe(tap(() => logger.log(`${request.url} ,${Date.now() - now}ms`)))
    }
}
