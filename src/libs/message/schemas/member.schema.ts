import { PlainLiteralObject } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true })
  type: number;

  @Prop({ type: Number, required: true })
  status: number;

  @Prop({ type: Number, required: true })
  createdTime: number;

  @Prop({ type: Number, required: true })
  totalUnread: number;

  @Prop({ type: Number, required: true })
  lastActionTime: number;

  @Prop({ type: Number, required: true })
  lastReadTime: number;

  @Prop({ type: String, required: false })
  lastReadMessageId: string;

  @Prop({ type: Number, default: 0 })
  deleteMessageTime: number;

  @Prop({ type: Number, default: 0 })
  isMute: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: PlainLiteralObject;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
