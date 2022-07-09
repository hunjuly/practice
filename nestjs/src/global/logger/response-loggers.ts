import { Request, Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class SuccessResLogger implements NestInterceptor {
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

@Catch(HttpException)
export class FailResLogger implements ExceptionFilter {
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        const body = {
            statusCode: status,
            message: exception.message,
            path: request.url,
            timestamp: new Date().toISOString()
        }

        Logger.warn('Exception', request.method, request.url, status, exception.message)

        response.status(status).json(body)
    }
}
