import { Type } from '@nestjs/common'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '../entities/user.entity'

const keys = ['id', 'email', 'isActive', 'role', 'createDate', 'updateDate', 'version'] as (keyof User)[]

export class ResponseUserDto extends PickType(User, keys) {
    @ApiProperty()
    url: string

    static create(user: User) {
        const url = `/users/${user.id}`

        const obj = {}

        keys.map((key) => {
            obj[key] = user[key]
        })

        obj[url] = url

        return obj as ResponseUserDto
    }
}
