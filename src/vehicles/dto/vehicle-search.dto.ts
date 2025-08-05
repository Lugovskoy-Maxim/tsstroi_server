import { IsOptional, IsString, IsNumber } from 'class-validator';

export class VehicleSearchDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  registration_number?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsNumber()
  year_from?: number;

  @IsOptional()
  @IsNumber()
  year_to?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}