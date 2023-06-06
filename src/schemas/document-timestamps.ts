import mongoose from 'mongoose';

export class DocumentTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId;
  __v?: number;
}
