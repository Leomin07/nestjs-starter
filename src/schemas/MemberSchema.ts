import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './BaseSchema';
import { PlainLiteralObject } from '@nestjs/common';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member extends BaseSchema {
  @Prop({ type: String, required: true, length: 255 })
  name: string;

  @Prop({ type: String, required: true, length: 20, unique: true })
  phone: string;

  @Prop({ type: String, required: true, length: 20 })
  birthday: string;

  @Prop({ type: String, required: false, length: 500, select: false })
  refreshToken?: string;

  @Prop({ type: String, required: false, length: 20, select: false })
  changePhoneCode?: string;

  @Prop({ type: Number, required: false, default: 0 })
  isSuperAdmin?: number;

  @Prop({ type: Number, required: false })
  roleId?: number;

  @Prop({ type: String, required: true, length: 255, select: false })
  password: string;

  @Prop({ type: Object, required: false })
  payload?: PlainLiteralObject;
}

export const MessageSchema = SchemaFactory.createForClass(Member);
