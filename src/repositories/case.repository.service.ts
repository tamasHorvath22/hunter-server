import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { Case, CaseDocument } from '../schemas/case.schema';

@Injectable()
export class CaseRepositoryService {
  constructor(@InjectModel(DocumentName.CASE) private caseModel: Model<CaseDocument>) {}

  // TODO refactor
  public async createCase(newCase: Case): Promise<Case> {
    const session = await this.caseModel.db.startSession();
    session.startTransaction();
    try {
      const newCaseDocument = new this.caseModel(newCase);
      await newCaseDocument.save();
      await session.commitTransaction();
      await session.endSession();
      return newCaseDocument;
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      return null
    }
  }

}
