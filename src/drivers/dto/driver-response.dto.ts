import { Expose, Transform } from 'class-transformer';

export class DriverResponseDto {
  @Expose()
  _id: string;
  
  @Expose()
  fullName: string;

  @Expose()
  licenseNumber: string;

  @Expose()
  licenseCategory: string;

  @Expose()
  @Transform(({ value }) => value.toISOString().split('T')[0])
  licenseExpiry: Date;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  address: string;

  @Expose()
  @Transform(({ value }) => value.toISOString().split('T')[0])
  birthDate: Date;

  @Expose()
  @Transform(({ value }) => value.toString())
  organization?: string;


  @Expose()
  status: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString().split('T')[0])
  hiredDate?: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString().split('T')[0])
  firedDate?: Date;

  @Expose()
  notes?: string;

  @Expose()
  workPass?: {
    number: string;
    issueDate: string;
    expiryDate: string;
    constructionSite: string;
  };

  @Expose()
  medicalExam?: {
    certificateNumber: string;
    issueDate: string;
    expiryDate: string;
    clinic?: string;
  };

  @Expose()
  psychologicalExam?: {
    certificateNumber: string;
    issueDate: string;
    expiryDate: string;
    center?: string;
  };
}