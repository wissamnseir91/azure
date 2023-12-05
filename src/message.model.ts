import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IMessage extends Document {
  type: string;
  message: string;
}

@Schema()
export class Message {
  @Prop({ required: true }) // Example: Adding required constraint
  type: string;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
