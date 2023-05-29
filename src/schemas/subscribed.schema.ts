import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { DocumentTimestamps } from './document-timestamps';

export type SubscribedDocument = Subscribed & Document;

@Schema({ timestamps: true })
export class Subscribed extends DocumentTimestamps {
  @Prop({ unique: true }) email: string;
}

export const SubscribedSchema = SchemaFactory.createForClass(Subscribed);
