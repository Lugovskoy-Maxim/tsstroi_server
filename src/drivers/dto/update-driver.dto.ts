import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsEnum(['A', 'B', 'C', 'D', 'E', 'BE', 'CE', 'DE'])
  licenseCategory?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  licenseExpiry?: Date;

  @IsOptional()
  @IsEnum(['active', 'suspended', 'fired', 'vacation'])
  status?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  firedDate?: Date;
}