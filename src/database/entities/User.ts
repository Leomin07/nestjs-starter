import { Column, Entity } from 'typeorm';
import { BaseModel } from './BaseModel';

@Entity('user')
export class User extends BaseModel {
  @Column({ name: 'role_id', type: 'smallint', comment: 'Role của admin' })
  roleId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'FullName or name',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password?: string;

  @Column({
    name: 'is_super_admin',
    type: 'smallint',
    default: 0,
    comment: '1: Active, 0:A Active',
  })
  isSuperAdmin?: number;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    nullable: true,
    select: false,
    comment: 'JWT token',
  })
  refreshToken?: string;
}
