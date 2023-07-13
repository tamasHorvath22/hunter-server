import { registerDecorator, ValidationOptions } from 'class-validator';
import { MotionType } from '../enums/motion-type';

export function IsMotionType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMotionType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return false;
          }
          return value === MotionType.simpleMajority || value === MotionType.qualifiedMajority;
        }
      }
    })
  }
}
