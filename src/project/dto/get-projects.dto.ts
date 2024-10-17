import {
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidNumber', async: false })
export class IsValidNumber implements ValidatorConstraintInterface {
  validate(text: string) {
    return !isNaN(+text);
  }

  defaultMessage(args: ValidationArguments) {
    return '($value) is not valid';
  }
}

export class GetProjectsDto {
  @Validate(IsValidNumber)
  @IsString()
  limit: string;

  @Validate(IsValidNumber)
  @IsString()
  offset: string;

  @IsOptional()
  @IsString()
  search?: string;
}
