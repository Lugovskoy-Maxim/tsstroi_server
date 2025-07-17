import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsArray, 
  IsDateString, 
  IsPhoneNumber, 
  IsUrl,
  IsIn,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Логин может содержать только буквы, цифры и символ подчеркивания'
  })
  login: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Пароль должен содержать хотя бы одну заглавную букву, цифру и специальный символ'
  })
  password: string;

  @IsOptional()
  @IsArray()
  @IsIn(['user', 'admin', 'moderator'], { each: true })
  roles?: string[];


  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsIn(['male', 'female'])
  sex?: 'male' | 'female';
}