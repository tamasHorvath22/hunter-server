import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Role } from "../enums/role";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true }) username: string;
  @Prop() password: string;
  @Prop() role: Role;
  @Prop() isActive: boolean;
  @Prop() validUntil: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
