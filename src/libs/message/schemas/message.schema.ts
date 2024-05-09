import { PlainLiteralObject } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: String, required: true })
  memberId: string;

  @Prop({ type: String, required: true })
  conversationId: string;

  @Prop({ type: Number, required: true })
  type: number;

  @Prop({ type: String, required: false })
  content: string;

  @Prop({ type: Number, required: true })
  status: number;

  @Prop({ type: Number, required: true })
  createdTime: number;

  @Prop({ type: String })
  deletedTime?: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: PlainLiteralObject;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
