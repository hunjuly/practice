import { Catch, ArgumentsHost, ConflictException } from '@nestjs/common'
import { AlreadyExistsException } from './domain/exceptions'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch(AlreadyExistsException)
export class AlreadyExistsExceptionFilter extends BaseExceptionFilter {
    catch(exception: AlreadyExistsException, host: ArgumentsHost) {
        super.catch(new ConflictException(exception.message), host)
    }
}
