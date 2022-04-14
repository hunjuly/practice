import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn
} from 'typeorm'
import { Photo } from 'src/photos/entities/photo.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    password: string

    @Column()
    email: string

    @OneToMany((type) => Photo, (photo) => photo.user)
    photos: Photo[]

    @Column({ default: true })
    isActive: boolean

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
