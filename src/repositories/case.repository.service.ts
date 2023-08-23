import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { Area, Case, CaseDocument } from '../schemas/case.schema';
import { CaseNotFoundException } from '../exceptions/case-not-found.exception';

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

  public async updateCase(caseId: mongoose.Types.ObjectId, updateCase: Partial<Case>): Promise<Case> {
    const currentCase = await this.getCase(caseId.toString());
    const session = await this.caseModel.db.startSession();
    session.startTransaction();

    await this.caseModel.updateOne(
      { _id: caseId },
      { $set: { ...updateCase, __v: currentCase.__v + 1 } }
    );
    await session.commitTransaction();
    await session.endSession();
    return this.getCase(caseId.toString());
  }

  public async modifyArea(caseId: mongoose.Types.ObjectId, areas: Area[], version: number): Promise<Case> {
    const session = await this.caseModel.db.startSession();
    session.startTransaction();

    await this.caseModel.updateOne(
      { _id: caseId },
      { $set: { rawAreas: areas, __v: version } }
    );
    await session.commitTransaction();
    await session.endSession();
    return this.getCase(caseId.toString());
  }

  public async deleteCaseById(caseId: mongoose.Types.ObjectId): Promise<void> {
    const session = await this.caseModel.db.startSession();
    session.startTransaction();
    await this.caseModel.deleteOne({ _id: caseId });
    await session.commitTransaction();
    await session.endSession();
  }

}
