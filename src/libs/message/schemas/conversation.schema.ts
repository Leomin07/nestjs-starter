import { PlainLiteralObject } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MemberDocument, MemberSchema } from './member.schema';

export type ConversationDocument = Conversation & Document;
export type LastMessageDocument = LastMessage & Document;

@Schema()
export class LastMessage {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  })
  _id: string;

  @Prop({ type: String, required: true })
  memberId: string;

  @Prop({ type: Number, required: true })
  type: number;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, required: true })
  createdTime: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: PlainLiteralObject;
}

const lastMessageSchema = SchemaFactory.createForClass(LastMessage);

@Schema()
export class Conversation {
  @Prop({ type: Number, required: true })
  type: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  avatar: string;

  @Prop([{ type: MemberSchema }])
  members: MemberDocument[];

  @Prop({ type: Number, required: true })
  status: number;

  @Prop({ type: lastMessageSchema })
  lastMessage?: LastMessageDocument;

  @Prop({ type: Number, required: true })
  createdTime: number;

  @Prop({ type: Number })
  deletedTime?: number;

  @Prop({ type: Number })
  guildId?: number;

  @Prop({ type: Number })
  priority?: number;

  @Prop({ type: Number })
  createdBy?: number;

  @Prop({ type: Number })
  eventId?: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: PlainLiteralObject;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
