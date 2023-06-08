import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { Case, CaseDocument } from '../schemas/case.schema';
import { CaseNotFoundException } from '../exceptions/case-not-found.exception';
import { UpdateCaseDto } from '../dtos/case-request.dtos';

@Injectable()
export class CaseRepositoryService {
  constructor(@InjectModel(DocumentName.CASE) private caseModel: Model<CaseDocument>) {}

  // TODO refactor
  public async createCase(newCase: Case): Promise<Case> {
    const session = await this.caseModel.db.startSession();
    session.startTransaction();
    try {
      const newCaseDocument = this.createAreaIds(new this.caseModel(newCase));
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

  public async getUserCases(userId: string): Promise<Case[]> {
    return await this.caseModel.find({ creator: { $in: userId }}).exec();
  }

  public async getCase(caseId: string): Promise<Case> {
    try {
      return await this.caseModel.findById(caseId).exec();
    } catch {
      throw new CaseNotFoundException();
    }
  }

  public async updateCase(caseId: mongoose.Types.ObjectId, updateCase: UpdateCaseDto): Promise<Case> {
    const session = await this.caseModel.db.startSession();
    session.startTransaction();

    await this.caseModel.updateOne(
      { _id: caseId },
      { $set: {
        name: updateCase.name,
        voters: updateCase.voters,
        includedAreaTypes: updateCase.includedAreaTypes,
        isClosed: updateCase.isClosed
      }}
    );
    await session.commitTransaction();
    await session.endSession();
    return this.getCase(caseId.toString());
  }

  private createAreaIds(newCase: CaseDocument): CaseDocument {
    const caseId = newCase._id.toString();
    for (let index = 0; index < newCase.rawAreas.length; index++) {
      newCase.rawAreas[index].id = `${caseId}-area-${index}`;
    }
    return newCase;
  }

}
