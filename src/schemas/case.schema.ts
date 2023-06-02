import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { DocumentTimestamps } from './document-timestamps';

export type CaseDocument = Case & Document;

@Schema({ timestamps: true })
export class Case extends DocumentTimestamps {
  @Prop() name: string;
  @Prop() creator: string;
  @Prop() isClosed: boolean;
  @Prop() rawAreas: Area[];
  @Prop() voters: Voter[];
  @Prop() includedAreaTypes: string[];
}

export const CaseSchema = SchemaFactory.createForClass(Case);

export class Area {
  @Prop() lotNumber: string;
  @Prop() owners: Owner[];
  @Prop() area: number;
  @Prop() type: string;
}

export class VoterArea extends Area {
  @Prop() quota: number;
  @Prop() isEligibleToVote: boolean;
}

export class Owner {
  @Prop() quota: number;
  @Prop() type: string;
  @Prop() details: string;
}

export class Voter {
  @Prop() areas: VoterArea[];
}
