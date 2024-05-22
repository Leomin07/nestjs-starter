import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoId } from 'src/helpers/common.type';
import { VerificationCodeStatus, VerificationCodeType } from 'src/helpers/enum';

export type VerificationCodeDocument = HydratedDocument<VerificationCode>;

@Schema()
export class VerificationCode {
  _id: MongoId;

  @Prop({ type: String, required: true, length: 20 })
  phone: string;

  @Prop({ type: Number, required: true, enum: VerificationCodeType })
  type: VerificationCodeType;

  @Prop({ type: String, required: true, length: 6 })
  code: string;

  @Prop({ type: Number, required: true, default: 0, max: 5 })
  retryCount: number;

  @Prop({
    type: Number,
    required: true,
    enum: VerificationCodeStatus,
    default: VerificationCodeStatus.ACTIVE,
  })
  status: VerificationCodeStatus;

  @Prop({ type: Date, required: true })
  expireAt: Date;

  @Prop({ type: Date })
  expireRetry?: Date;

  @Prop({ type: Date })
  useAt?: Date;

  @Prop({ type: Date, default: Date.now })
  retryAt: Date;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);
