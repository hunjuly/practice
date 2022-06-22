import { Request, Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name)

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

        this.logger.log(JSON.stringify(body))

        response.status(status).json(body)
    }
}
