import { BaseEntity as OrgBaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { OmitType } from '@nestjs/swagger'
import { Type } from '@nestjs/common'

export abstract class BaseEntity extends OrgBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string
}

export function OmitBaseEntity<T extends OrgBaseEntity>(classRef: Type<T>) {
    return OmitType(classRef, ['hasId', 'save', 'remove', 'softRemove', 'recover', 'reload'])
}
