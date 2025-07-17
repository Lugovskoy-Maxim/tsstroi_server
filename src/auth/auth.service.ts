import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from '../users/dto/login-response.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { UserDocument } from '../schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async login(user: UserDocument): Promise<LoginResponseDto> {
    try {
      const payload: JwtPayload = {
        sub: user._id.toString(), // Теперь _id имеет явный тип
        login: user.login,
        roles: user.roles,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        access_token: accessToken,
        userId: user._id.toString(),
        login: user.login,
        email: user.email,
        roles: user.roles,
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при генерации токена');
    }
  }

  async register(userDto: RegisterUserDto): Promise<LoginResponseDto> {
    try {
      const existingUser = await this.usersService.findOneByLoginOrEmail(
        userDto.login,
      );
      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким логином или email уже существует',
        );
      }

      const hashedPassword = await this.hashPassword(userDto.password);

      // Создаем объект для создания пользователя без обязательных методов
      const userToCreate = {
        login: userDto.login,
        email: userDto.email,
        password: hashedPassword,
        roles: userDto.roles || ['user'],
        verifiedEmail: false,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        phoneNumber: userDto.phoneNumber,
        birthday: userDto.birthday,
        avatar: userDto.avatar,
        sex: userDto.sex,
      };

      const createdUser = await this.usersService.create(userToCreate);
      return this.login(createdUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ошибка при регистрации пользователя',
      );
    }
  }
  async validateUser(
    login: string,
    password: string,
  ): Promise<Omit<UserDocument, 'password'>> {
    try {
      // Получаем пользователя с паролем
      const user = await this.usersService.findOneByLoginOrEmail(login);

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      // Проверяем пароль
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный пароль');
      }

      // Возвращаем пользователя без пароля
      const { password: _, ...result } = user.toObject();
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ошибка при валидации пользователя',
      );
    }
  }
}
