import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator'

export class CreateUserDto {
    /**
     * A list of user's roles?
     * @example ['admin']
     */
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
