import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Role } from "../enums/role";
import { DocumentTimestamps } from './document-timestamps';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends DocumentTimestamps {
  @Prop({ unique: true }) email: string;
  @Prop() role: Role;
  @Prop() isActive: boolean;
  @Prop() validUntil: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
