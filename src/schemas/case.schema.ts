import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { CaseParticipant } from '../types/case-participant';

export type CaseDocument = Case & Document;

@Schema({ timestamps: true })
export class Case {
  @Prop() name: string;
  @Prop() owner: string;
  @Prop() isOpen: boolean;
  @Prop() participants: CaseParticipant[];
}

export const CaseSchema = SchemaFactory.createForClass(Case);
