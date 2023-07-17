import { registerDecorator, ValidationOptions } from 'class-validator';
import { VoteType } from '../enums/vote-type';

export function AreMotionVoters(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'AreMotionVoters',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'object') {
            return false;
          }
          return Object.values(value).every(v => Object.values(VoteType).includes(v as VoteType));
        }
      }
    })
  }
}
