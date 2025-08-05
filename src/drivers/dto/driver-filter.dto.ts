import { IsOptional, IsString, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class DriverFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsEnum(['A', 'B', 'C', 'D', 'E', 'BE', 'CE', 'DE'])
  licenseCategory?: string;

  @IsOptional()
  @IsEnum(['active', 'suspended', 'fired', 'vacation'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  expiredLicense?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  expiredMedicalExam?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeDeleted?: boolean = false;
}