import { IsString, IsNotEmpty, Matches, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{10}$/)
  inn: string;

  @IsNotEmpty()
  @Matches(/^\d{13}$/)
  ogrn: string;

  @IsNotEmpty()
  @IsIn(['LLC', 'JSC', 'IE', 'PE', 'OTHER'])
  legalForm: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @Matches(/^\+7\d{10}$/)
  phone: string;

  @IsNotEmpty()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  email: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}