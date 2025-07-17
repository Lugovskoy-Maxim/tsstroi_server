import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';

interface CustomRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'strict',
      path: '/',
    });

    return { success: true, access_token };
  }

  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!body?.login || !body?.password) {
        throw new HttpException(
          'Не все обязательные поля заполнены.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { access_token } = await this.authService.register(body);

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
        sameSite: 'strict',
        path: '/',
      });

      return { success: true, message: 'Регистрация прошла успешно' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Ошибка при регистрации',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true, message: 'Вы вышли из аккаунта' };
  }
}
