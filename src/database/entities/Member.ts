import { Column, Entity } from 'typeorm';
import { BaseModel } from './BaseModel';

@Entity('member')
export class Member extends BaseModel {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'FullName or name',
  })
  name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
    comment: 'Your phone member',
  })
  phone: string;

  @Column({
    name: 'birthday',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Birthday member',
  })
  birthday: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    nullable: true,
    select: false,
    comment: 'JWT token for authentication',
  })
  refreshToken?: string;

  @Column({
    name: 'change_phone_code',
    type: 'varchar',
    length: 20,
    nullable: true,
    select: false,
    comment: 'Code for change phone number',
  })
  changePhoneCode: string;

  @Column({
    name: 'is_super_admin',
    type: 'tinyint',
    default: 0,
    nullable: true,
    comment: '1: Active, 0:A Active',
  })
  isSuperAdmin?: number;

  @Column({
    name: 'role_id',
    type: 'tinyint',
    comment: 'Role for admin',
    nullable: true,
  })
  roleId?: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  password?: string;
}
