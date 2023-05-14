import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { CaseDocument } from '../schemas/case.schema';

@Injectable()
export class CaseRepositoryService {
  constructor(@InjectModel(DocumentName.CASE) private caseModel: Model<CaseDocument>) {}

  public async createCase(caseName: string, owner: string): Promise<boolean> {
    const session = await this.caseModel.db.startSession();
    session.startTransaction();
    try {
      const newCase = new this.caseModel({
        name: caseName,
        owner: owner,
        participants: [],
        isOpen: true
      });
      await newCase.save();
      await session.commitTransaction();
      return true;
    } catch (e) {
      await session.abortTransaction();
      return false;
    } finally {
      await session.endSession();
    }
  }

}
