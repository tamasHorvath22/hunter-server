import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { CaseParticipant } from '../types/case-participant';
import { DocumentTimestamps } from './document-timestamps';

export type CaseDocument = Case & Document;

@Schema({ timestamps: true })
export class Case extends DocumentTimestamps {
  @Prop() name: string;
  @Prop() owner: string;
  @Prop() isOpen: boolean;
  @Prop() participants: CaseParticipant[];
  @Prop({ type: Object }) excelSource: Record<any, any>;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
