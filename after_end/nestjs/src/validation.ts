import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  isDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidationOptions
} from 'class-validator';
import { Transform } from 'class-transformer';
import { applyDecorators, Injectable, FileValidator, BadRequestException } from '@nestjs/common';
import sanitize from 'sanitize-filename';

export class UUIDParamDto {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({ format: 'uuid' })
  id!: string;
}

export const isValidInteger = (value: number, options: { min?: number; max?: number }): value is number => {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = options;
  return Number.isInteger(value) && value >= min && value <= max;
};

type BooleanOptions = { optional?: boolean };
export const ValidateBoolean = (options?: BooleanOptions) => {
  const { optional } = { optional: false, ...options };
  const decorators = [
    // ApiProperty(),
    IsBoolean(),
    Transform(({ value }) => {
      if (value == 'true') {
        return true;
      } else if (value == 'false') {
        return false;
      }
      return value;
    }),
  ];

  if (optional) {
    decorators.push(Optional());
  }

  return applyDecorators(...decorators);
};


export interface OptionalOptions extends ValidationOptions {
  nullable?: boolean;
}
/**
 * Checks if value is missing and if so, ignores all validators.
 *
 * @param validationOptions {@link OptionalOptions}
 *
 * @see IsOptional exported from `class-validator.
 */
// https://stackoverflow.com/a/71353929
export function Optional({ nullable, ...validationOptions }: OptionalOptions = {}) {
  if (nullable === true) {
    return IsOptional(validationOptions);
  }

  return ValidateIf((object: any, v: any) => v !== undefined, validationOptions);
}

type IValue = { value: string };

export const toEmail = ({ value }: IValue) => value?.toLowerCase();

export const toSanitized = ({ value }: IValue) => sanitize((value || '').replaceAll('.', ''));

@Injectable()
export class FileNotEmptyValidator extends FileValidator {
  constructor(private requiredFields: string[]) {
    super({});
    this.requiredFields = requiredFields;
  }

  isValid(files?: any): boolean {
    if (!files) {
      return false;
    }

    return this.requiredFields.every((field) => files[field]);
  }

  buildErrorMessage(): string {
    return `${this.requiredFields.join(', ')} 不能为空`;
  }
}

type DateOptions = { optional?: boolean; nullable?: boolean; format?: 'date' | 'date-time' };
export const ValidateDate = (options?: DateOptions) => {
  const { optional, nullable, format } = { optional: false, nullable: false, format: 'date-time', ...options };

  const decorators = [
    ApiProperty({ format }),
    IsDate(),
    optional ? Optional({ nullable: true }) : IsNotEmpty(),
    Transform(({ key, value }) => {
      if (value === null || value === undefined) {
        return value;
      }

      if (!isDateString(value)) {
        throw new BadRequestException(`${key} 必须是日期字符串`);
      }

      return new Date(value as string);
    }),
  ];

  if (optional) {
    decorators.push(Optional({ nullable }));
  }

  return applyDecorators(...decorators);
};
