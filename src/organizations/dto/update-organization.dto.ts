import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsOptional, Matches, IsBoolean } from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsOptional()
  @Matches(/^\+7\d{10}$/)
  phone?: string;

  @IsOptional()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}