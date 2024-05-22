import { Prop, Schema } from '@nestjs/mongoose';
import { MongoId } from 'src/helpers/common.type';
import { CommonStatus } from 'src/helpers/enum';

@Schema({})
export class BaseSchema {
  _id: MongoId;

  @Prop({ type: Number, required: true, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt?: Date;
}
