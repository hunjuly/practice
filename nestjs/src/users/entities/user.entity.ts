import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn
} from 'typeorm'
import { Authentication } from 'src/auth/entities/authentication.entity'
import { EntityBase } from 'src/common/entity'

@Entity()
export class User extends EntityBase {
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

    // { useSoftDelete: true });
    @DeleteDateColumn()
    deleteDate: Date

    @VersionColumn()
    version: number
}
