import { ProjectStatus } from '@prisma/client';
import {
  IsString,
  IsUrl,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  url?: string;

  @IsOptional()
  @IsDateString()
  @IsString()
  expiredAt?: string;

  @IsOptional()
  @IsString()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
