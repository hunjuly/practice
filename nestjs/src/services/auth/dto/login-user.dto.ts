import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
    /**
     * email 형식을 지켜야 한다.
     * @example user@mail.com
     */
    @IsEmail()
    email: string

    /**
     * 빈 문자열은 허용하지 않는다.
     */
    @IsNotEmpty()
    password: string
}
