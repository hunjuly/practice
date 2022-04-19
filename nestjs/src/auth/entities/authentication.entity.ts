import { Entity, Column, UpdateDateColumn, PrimaryColumn } from 'typeorm'

@Entity()
export class Authentication {
    @PrimaryColumn('uuid')
    userId: string

    @Column()
    password: string

    @UpdateDateColumn()
    updateDate: Date
}
