import { IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString() name: string;
}
