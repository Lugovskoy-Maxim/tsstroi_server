import { IsString, IsNumber, IsNotEmpty, Matches, IsIn } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @Matches(/^([0-9]\d{2,3}[A-Z]{2}\d{4}|[A-Z]\d{3}[A-Z]{2}\s?[0-9]\d{2,3})$/, {
    message: 'Неверный формат регистрационного номера',
  })
  registration_number: string;

  @IsNotEmpty()
  @IsString()
  region_number: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  brand_model: string;

  @IsNotEmpty()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/i)
  VIN_number: string;

  @IsNotEmpty()
  @IsString()
  organization: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsIn(['active', 'idle', 'repair'])
  status?: string;
}