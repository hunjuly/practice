import {
    Entity,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    PrimaryGeneratedColumn
} from 'typeorm'
import { Authentication } from 'src/auth/entities/authentication.entity'
import { BaseEntity } from 'src/common/base-entity'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

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
}
