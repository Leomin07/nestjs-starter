import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonStatus, ReadNotification } from '../../helpers/enum';

@Entity('notification_member')
export class NotificationMember {
  @Index()
  @PrimaryColumn({
    name: 'notification_id',
    type: 'bigint',
    unsigned: true,
    nullable: false,
  })
  notificationId: number;

  @Index()
  @PrimaryColumn({
    name: 'member_id',
    type: 'bigint',
    unsigned: true,
    nullable: false,
  })
  memberId: number;

  @Index()
  @Column({
    name: 'is_read',
    type: 'smallint',
    default: ReadNotification.UNREAD,
  })
  isRead: ReadNotification;

  @Index()
  @Column({
    name: 'status',
    type: 'smallint',
    default: CommonStatus.ACTIVE,
  })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
