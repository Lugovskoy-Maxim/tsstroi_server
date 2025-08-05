import { IsOptional, IsString, IsBoolean, IsIn, IsNumber } from 'class-validator';

export class OrganizationSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsIn(['LLC', 'JSC', 'IE', 'PE', 'OTHER'])
  legalForm?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}