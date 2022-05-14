export class AlreadyExistsException extends Error {
    constructor(message = 'already exists user') {
        super(message)
    }
}
