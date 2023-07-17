import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { DocumentTimestamps } from './document-timestamps';
import { MotionType } from '../enums/motion-type';
import { VoteType } from '../enums/vote-type';

export type CaseDocument = Case & Document;

@Schema({ timestamps: true })
export class Case extends DocumentTimestamps {
  @Prop() name: string;
  @Prop() creator: string;
  @Prop() isClosed: boolean;
  @Prop() isRegistrationClosed: boolean;
  @Prop() rawAreas: Area[];
  @Prop() voters: Voter[];
  @Prop() includedAreaTypes: string[];
  @Prop() motions: Motion[];
  @Prop() excludedVoters: string[];
}

export const CaseSchema = SchemaFactory.createForClass(Case);

export class Area {
  @Prop() lotNumber: string;
  @Prop() owners: Owner[];
  @Prop() area: number;
  @Prop() type: string;
  @Prop() groupByTypes: TypeAndArea[];
  @Prop() isManuallyCreated: boolean;
}

export class TypeAndArea {
  @Prop() area: number;
  @Prop() type: string;
}

export class Owner {
  @Prop() quota: number;
  @Prop() type: string;
  @Prop() details: string;
  @Prop() id: string;
  @Prop() name?: string;
  @Prop() address?: string;
  @Prop() motherName?: string;
}

export class Voter {
  @Prop() areas: VoterArea[];
  @Prop() name: string;
  @Prop() company: string;
  @Prop() id: string;
}

export class VoterArea {
  @Prop() areaLotNumber: string;
  @Prop() quota: number;
  @Prop() includedTypes: string[];
}

export class Motion {
  @Prop() name: string;
  @Prop() details: string;
  @Prop({ type: Object }) voters: Record<string, VoteType>;
  @Prop() type: MotionType;
  @Prop() id: string;
}

export interface NewOwner {
  details: string;
  quota: number;
  id: string;
  addToVoter: boolean;
  type: string;
  address: string;
  motherName: string;
  name: string;
}
