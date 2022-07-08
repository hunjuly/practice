import { ConflictException } from '@nestjs/common'

export class AlreadyExistsException extends ConflictException {
    constructor(message = 'already exists user') {
        super(message)
    }
}
