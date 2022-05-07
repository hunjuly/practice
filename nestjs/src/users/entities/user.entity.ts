import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm'
import { Authentication } from 'src/auth/entities/authentication.entity'
import { BaseEntity } from 'src/common/base-entity-ext'
import { ConflictException } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { Pagination } from 'src/common/pagination'

@Entity()
export class User extends BaseEntity {
    @Column()
    email: string

    @OneToMany(() => Authentication, (auth) => auth.user)
    auths: Authentication[]

    @Column({ default: true })
    isActive: boolean

    @Column({ default: 'user' })
    role: string

    @CreateDateColumn()
    createDate: Date

    @UpdateDateColumn()
    updateDate: Date

    @VersionColumn()
    version: number

    static async add(dto: CreateUserDto) {
        const existUser = await this.findByEmail(dto.email)

        if (existUser) throw new ConflictException()

        const user = User.create(dto)

        await user.save()

        return user
    }

    static async findByEmail(email: string) {
        // 같은 코드다. 연습이다.
        // return this.createQueryBuilder('user').where('user.email = :email', { email }).getOne()
        return User.findOne({ where: { email } })
    }

    static async findAll(page: Pagination) {
        const [items, total] = await User.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: {
                createDate: 'DESC'
            }
        })

        return { items, total }
    }
}
