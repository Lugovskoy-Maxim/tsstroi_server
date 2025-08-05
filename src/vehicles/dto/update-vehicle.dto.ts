import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { IsString, IsOptional, Matches, IsIn } from 'class-validator';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @IsOptional()
  @Matches(/^([0-9]\d{2,3}[A-Z]{2}\d{4}|[A-Z]\d{3}[A-Z]{2}\s?[0-9]\d{2,3})$/, {
    message: 'Неверный формат регистрационного номера',
  })
  registration_number?: string;

  @IsOptional()
  @IsString()
  region_number?: string;

  @IsOptional()
  @IsIn(['active', 'idle', 'repair'])
  status?: string;
}