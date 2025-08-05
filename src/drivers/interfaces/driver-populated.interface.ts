export interface DriverResponseDto {
  _id: string;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  phone: string;
  email: string;
  address: string;
  birthDate: Date;
  organization: string;
  status: string;
  hiredDate?: Date;
  firedDate?: Date;
  notes?: string;
  workPass?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    constructionSite: string;
  };
  medicalExam?: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    clinic?: string;
  };
  psychologicalExam?: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    center?: string;
  };
}