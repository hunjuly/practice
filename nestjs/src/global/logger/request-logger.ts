import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class RequestLogger implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        Logger.verbose('Request', req.method, req.url)
        next()
    }
}
