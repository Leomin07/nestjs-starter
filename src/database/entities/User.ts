import { Column, Entity } from 'typeorm';
import { BaseModel } from './BaseEntity';

@Entity('user')
export class User extends BaseModel {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  phone: string;
}
