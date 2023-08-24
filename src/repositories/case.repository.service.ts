import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { Area, Case, CaseDocument } from '../schemas/case.schema';
import { CaseNotFoundException } from '../exceptions/case-not-found.exception';
import { Response } from '../enums/response';
import { LoggerService } from '../services/logger.service';
import { LoggerType } from '../enums/logger-type';
import { CaseUpdateErrorException } from '../exceptions/case-update-error.exception';

@Injectable()
export class CaseRepositoryService {
  constructor(
    @InjectModel(DocumentName.CASE) private caseModel: Model<CaseDocument>,
    private loggerService: LoggerService
  ) {}

  public async createCase(newCase: Case): Promise<Case> {
    try {
      const newCaseDocument = new this.caseModel(newCase);
      await newCaseDocument.save();
      return newCaseDocument;
    } catch (error) {
      this.loggerService.error(LoggerType.CASE_REPOSITORY_SERVICE, `Case create error, ${error}`);
      throw new HttpException(Response.CASE_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserCases(userId: string): Promise<Case[]> {
    try {
      return await this.caseModel.find({ creator: { $in: userId }}).exec();
    } catch (error) {
      this.loggerService.error(LoggerType.CASE_REPOSITORY_SERVICE, `Cases meta find error, ${error}`);
      throw new HttpException(Response.CASES_META_FIND_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findCase(caseId: string): Promise<Case> {
    try {
      return await this.caseModel.findById(caseId).exec();
    } catch (error) {
      this.loggerService.error(LoggerType.CASE_REPOSITORY_SERVICE, `Find case error, ${error}`);
      throw new CaseNotFoundException();
    }
  }

  public async updateCase(caseId: mongoose.Types.ObjectId, updateCase: Partial<Case>): Promise<Case> {
    try {
      const currentCase = await this.findCase(caseId.toString());
      await this.caseModel.updateOne(
        { _id: caseId },
        { $set: { ...updateCase, __v: currentCase.__v + 1 } }
      );
      return this.findCase(caseId.toString());
    } catch (error) {
      this.loggerService.error(LoggerType.CASE_REPOSITORY_SERVICE, `Case update error, ${error}`);
      throw new CaseUpdateErrorException();
    }
  }

  public async modifyArea(caseId: mongoose.Types.ObjectId, areas: Area[], version: number): Promise<Case> {
    try {
      await this.caseModel.updateOne(
        { _id: caseId },
        { $set: { rawAreas: areas, __v: version } }
      );
      return this.findCase(caseId.toString());
    } catch (error) {
      this.loggerService.error(LoggerType.CASE_REPOSITORY_SERVICE, `Area update error, ${error}`);
      throw new CaseUpdateErrorException();
    }
  }

  public async deleteCaseById(caseId: mongoose.Types.ObjectId): Promise<void> {
    try {
      await this.caseModel.deleteOne({ _id: caseId });
    } catch (error) {
      this.loggerService.error(LoggerType.CASE_REPOSITORY_SERVICE, `Case delete error, case id: ${caseId.toString()}, ${error}`);
      throw new HttpException(Response.DELETE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // public async createCase(newCase: Case): Promise<Case> {
  //   const session = await this.caseModel.db.startSession();
  //   session.startTransaction();
  //   try {
  //     const newCaseDocument = new this.caseModel(newCase);
  //     await newCaseDocument.save();
  //     await session.commitTransaction();
  //     await session.endSession();
  //     return newCaseDocument;
  //   } catch (e) {
  //     await session.abortTransaction();
  //     await session.endSession();
  //     return null
  //   }
  // }
}
