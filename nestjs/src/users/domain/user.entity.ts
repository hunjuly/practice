import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    PrimaryGeneratedColumn
} from 'typeorm'
import { BaseEntity } from 'src/common/base-entity'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    email: string

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
