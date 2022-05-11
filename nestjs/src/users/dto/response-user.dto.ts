import { Type } from '@nestjs/common'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '../entities/user.entity'

const keys = ['id', 'email', 'isActive', 'role', 'createDate', 'updateDate', 'version']

function createResponse<T, K extends keyof T>(classRef: Type<T>, keys: readonly K[]) {
    return
}

// export declare function PickType<T, K extends keyof T>(classRef: Type<T>, keys: readonly K[]): Type<Pick<T, typeof keys[number]>>;

export class ResponseUserDto<T> extends PickType(typeof T, keys as (keyof T)[]) {
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
