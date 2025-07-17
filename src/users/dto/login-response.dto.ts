import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class LoginResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  userId: string; 

  @Expose()
  @IsString()
  @IsNotEmpty()
  login: string;

  @Expose()
  @IsString()
  @IsOptional()
  email?: string;

  @Expose()
  @IsArray()
  @IsOptional()
  roles?: string[];
}
