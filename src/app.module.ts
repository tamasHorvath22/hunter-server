import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { UserController } from './controllers/user.controller';
import { UserRepositoryService } from './repositories/user.repository.service';
import { UserService } from './services/user.service';
import { DocumentName } from "./enums/document-name";
import { UserSchema } from "./schemas/user.schema";
import { CaseSchema } from './schemas/case.schema';
import { CaseController } from './controllers/case.controller';
import { CaseService } from './services/case.service';
import { CaseRepositoryService } from './repositories/case.repository.service';
import { SubscribedSchema } from './schemas/subscribed.schema';
import { SubscribedRepositoryService } from './repositories/subscribed.repository.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}${process.env.DB_NAME}?retryWrites=true&w=majority`),
    MongooseModule.forFeature([
      { name: DocumentName.USER, schema: UserSchema },
      { name: DocumentName.CASE, schema: CaseSchema },
      { name: DocumentName.SUBSCRIBED, schema: SubscribedSchema }
    ]),
    JwtModule.register({ secret: process.env.ACCESS_JWT_PRIVATE_KEY })
  ],
  controllers: [
    UserController,
    CaseController
  ],
  providers: [
    UserService,
    UserRepositoryService,
    CaseService,
    CaseRepositoryService,
    SubscribedRepositoryService
  ]
})
export class AppModule {}
