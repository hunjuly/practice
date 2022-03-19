import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user: number
}
