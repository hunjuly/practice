import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateAuthDto {
    @IsNotEmpty()
    userId: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
