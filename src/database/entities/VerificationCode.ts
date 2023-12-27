import { VerificationCodeStatus, VerificationCodeType } from 'src/helpers/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('verification_code')
export class VerificationCode {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'type',
    type: 'smallint',
    comment: '1: Register, 2: Change device',
    nullable: false,
  })
  type: VerificationCodeType;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 6,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'retry_count',
    type: 'smallint',
    default: 0,
    comment: 'Max: 5',
  })
  retryCount: number;

  @Column({
    name: 'status',
    type: 'smallint',
    comment: '1: active, 0: inactive',
    default: 1,
  })
  status: VerificationCodeStatus;

  @Column({
    name: 'expire_at',
    type: 'timestamp',
    nullable: false,
  })
  expireAt: string;

  @Column({
    name: 'expire_retry',
    type: 'timestamp',
    nullable: true,
  })
  expireRetry: string;

  @Column({ name: 'use_at', type: 'timestamp' })
  useAt: string;

  @Column({
    name: 'retry_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  retryAt: string;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
  })
  updateAt: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: string;
}
