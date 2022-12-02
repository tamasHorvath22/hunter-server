import { registerDecorator, ValidationOptions } from 'class-validator';
import { Role } from '../enums/role';

export function IsRole(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(Role).includes(value)
        },
      },
    });
  };
}
