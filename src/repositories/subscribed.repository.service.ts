import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { DocumentName } from '../enums/document-name';
import { FilterQuery, Model, Connection } from 'mongoose';
import { Subscribed, SubscribedDocument } from '../schemas/subscribed.schema';

@Injectable()
export class SubscribedRepositoryService {
  constructor(
    @InjectModel(DocumentName.SUBSCRIBED) private subscribedModel: Model<SubscribedDocument>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  public async find(subscribedFilterQuery: FilterQuery<Subscribed>): Promise<SubscribedDocument> {
    return this.subscribedModel.findOne(subscribedFilterQuery);
  }

  public async findSubscribers(query: string): Promise<SubscribedDocument[]> {
    return this.subscribedModel.find({'email' : { $regex : query } });
  }

  public async createSubscriber(subscriber): Promise<Subscribed> {
    const newSubscriber = new this.subscribedModel(subscriber);
    await newSubscriber.save();
    return newSubscriber;
  }

}
