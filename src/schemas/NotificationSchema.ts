import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoId } from 'src/helpers/common.type';
import {
  CommonStatus,
  NotificationTargetType,
  ReadNotification,
} from 'src/helpers/enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  _id: MongoId;

  @Prop({ type: Number, required: false })
  type?: number;

  @Prop({ type: String, required: false, maxlength: 500 })
  title?: string;

  @Prop({ type: String, required: false, maxlength: 500 })
  url?: string;

  @Prop({ type: Number, required: true })
  redirectId: number;

  @Prop({ type: Number, required: false })
  redirectType?: number;

  @Prop({
    type: Number,
    required: true,
    default: NotificationTargetType.COMMON,
  })
  targetType: NotificationTargetType;

  @Prop({ type: String, required: false })
  uuid?: string;

  @Prop({ type: String, required: false, maxlength: 255 })
  image?: string;

  @Prop({ type: Number, required: true })
  createBy: number;

  @Prop({ type: Number, required: false })
  deletedBy?: number;

  @Prop({ type: Number, required: false })
  updatedBy?: number;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export type NotificationMemberDocument = HydratedDocument<NotificationMember>;

@Schema()
export class NotificationMember {
  _id: MongoId;

  @Prop({ type: Number, required: true })
  notificationId: number;

  @Prop({ type: Number, required: true })
  memberId: number;

  @Prop({ type: Number, required: true, default: ReadNotification.UNREAD })
  isRead: ReadNotification;

  @Prop({ type: Number, required: true, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const NotificationMemberSchema =
  SchemaFactory.createForClass(NotificationMember);
