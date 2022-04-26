import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateUserDto {
    /**
     * A list of user's roles?
     * @example ['admin']
     */
    @IsUUID()
    email: string

    @IsNotEmpty()
    password: string
}
