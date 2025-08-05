import { IsString, IsNotEmpty, IsDate, IsEmail, IsPhoneNumber, IsArray, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @IsNotEmpty()
  @IsEnum(['A', 'B', 'C', 'D', 'E', 'BE', 'CE', 'DE'])
  licenseCategory: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  licenseExpiry: Date;

  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthDate: Date;

  @IsOptional()
  @IsString()
  organization?: string; // ID организации


  @IsOptional()
  @IsEnum(['active', 'suspended', 'fired', 'vacation'])
  status?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  hiredDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  workPass?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    constructionSite: string;
  };

  @IsOptional()
  medicalExam?: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    clinic?: string;
  };

  @IsOptional()
  psychologicalExam?: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    center?: string;
  };
}