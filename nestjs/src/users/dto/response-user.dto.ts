import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '../domain'

const keys = ['id', 'email', 'isActive', 'role', 'createDate', 'updateDate', 'version'] as (keyof User)[]

export class ResponseUserDto extends PickType(User, keys) {
    @ApiProperty()
    url: string

    static create(user: User) {
        const url = `/users/${user.id}`

        const obj = { url }

        keys.map((key) => {
            obj[key] = user[key]
        })

        return obj as ResponseUserDto
    }
}
