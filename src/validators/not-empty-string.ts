import { IsString } from 'class-validator';
import { Response } from '../enums/response';

export const IsNotEmptyString: Function = () => IsString({ message: Response.MUST_BE_STRING });
