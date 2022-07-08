import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('Middle -- ', req.method, req.url, res.statusCode)
        next()
    }
}

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//     async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//         const now = Date.now()

//         const request = context.switchToHttp().getRequest()

//         const body = JSON.stringify(request.body)

//         const response = context.switchToHttp().getResponse()

//         const message = `${request.url}, body: ${body}, status: ${response.statusCode}  ${Date.now() - now}ms`

//         return next.handle().pipe(tap(() => Logger.log(message)))
//     }
// }
