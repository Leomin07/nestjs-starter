import { CommonStatus } from 'src/helpers/enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseModel {
  @Index()
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({
    type: 'smallint',
    default: CommonStatus.ACTIVE,
    nullable: false,
    comment: '0:Inactive, 1: Active, 2:Pending',
  })
  status: CommonStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createAt: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updateAt: Date;
}
