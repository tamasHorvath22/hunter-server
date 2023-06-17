import { registerDecorator, ValidationOptions } from 'class-validator';

export function AreAreasByGroup(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'AreAreasByGroup',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'object') {
            return false;
          }
          for (const key of Object.keys(value)) {
            if (typeof key !== 'string' || typeof value[key] !== 'number') {
              return false;
            }
          }
          return true;
        }
      }
    })
  }
}
