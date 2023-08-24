import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { DocumentName } from '../enums/document-name';
import { FilterQuery, Model, Connection } from 'mongoose';
import { Subscribed, SubscribedDocument } from '../schemas/subscribed.schema';
import { LoggerService } from '../services/logger.service';
import { LoggerType } from '../enums/logger-type';
import { Response } from '../enums/response';

@Injectable()
export class SubscribedRepositoryService {
  constructor(
    @InjectModel(DocumentName.SUBSCRIBED) private subscribedModel: Model<SubscribedDocument>,
    @InjectConnection() private readonly connection: Connection,
    private loggerService: LoggerService
  ) {}

  public async find(subscribedFilterQuery: FilterQuery<Subscribed>): Promise<SubscribedDocument> {
    try {
      return await this.subscribedModel.findOne(subscribedFilterQuery);
    } catch (error) {
      this.loggerService.error(
        LoggerType.SUBSCRIBED_REPOSITORY_SERVICE,
        `Finding subscriber error: ${subscribedFilterQuery.email}, ${error}`
      );
      throw new HttpException(Response.SUBSCRIBED_NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findSubscribers(query: string): Promise<SubscribedDocument[]> {
    return this.subscribedModel.find({'email' : { $regex : query } });
  }

  public async createSubscriber(subscriber): Promise<Subscribed> {
    try {
      const newSubscriber = new this.subscribedModel(subscriber);
      await newSubscriber.save();
      return newSubscriber;
    } catch (error) {
      this.loggerService.error(
        LoggerType.SUBSCRIBED_REPOSITORY_SERVICE,
        `Creating subscriber error: ${subscriber.email}, ${error}`
      );
      throw new HttpException(Response.SUBSCRIBED_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
