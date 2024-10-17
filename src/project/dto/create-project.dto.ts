import { IsString, IsUrl, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsUrl()
  @IsString()
  url: string;

  @IsDateString()
  @IsString()
  expiredAt: string;
}
