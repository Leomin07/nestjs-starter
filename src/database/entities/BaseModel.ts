import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonStatus } from '../../helpers/enum';

@Entity()
export class BaseModel {
  @Index()
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({
    type: 'tinyint',
    default: CommonStatus.ACTIVE,
    nullable: false,
    comment: '0:Inactive, 1: Active, 2:Pending',
  })
  status: CommonStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  updateAt: string;
}
