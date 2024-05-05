import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';
import { NotificationTargetType } from '../../helpers/enum';
import { BaseModel } from './BaseModel';

@Entity('notification')
export class Notification extends BaseModel {
  @Column({ name: 'type', type: 'tinyint', nullable: true })
  type?: number;

  @Column({ name: 'title', type: 'varchar', length: '500', nullable: true })
  title?: string;

  @Column({ name: 'url', type: 'varchar', length: 500, nullable: true })
  url?: string;

  @Index()
  @Column({
    name: 'redirect_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  redirect_id: number;

  @Index()
  @Column({ name: 'redirect_type', type: 'tinyint', nullable: true })
  redirectType?: number;

  @Index()
  @Column({ name: 'target_type', type: 'tinyint', default: 1 })
  targetType: NotificationTargetType;

  @Column({ name: 'uuid', type: 'uuid', nullable: true })
  uuid: number;

  @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
  image: string;

  @Index()
  @Column({
    name: 'created_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  createBy: number;

  @Index()
  @Column({
    name: 'deleted_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  deletedBy: number;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
    unsigned: true,
  })
  updatedBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
