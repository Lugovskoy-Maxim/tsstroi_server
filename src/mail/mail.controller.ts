import {
  Controller,
  Post,
  Get,
  Query,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
import { RequestWithUser } from 'src/users/interfaces/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-verification/me')
  @UseGuards(AuthGuard) // Требуется аутентификация

  async sendVerificationToMe(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      // Получаем ID пользователя из аутентификационных данных
      const userId = req.user.sub;

      // Отправляем письмо подтверждения
      const result = await this.mailService.sendVerificationById(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: `Письмо с подтверждением отправлено на ${result.email}`,
      });
    } catch (error: unknown) {
      const status =
        error instanceof Error && 'status' in error
          ? (error as { status: number }).status
          : HttpStatus.BAD_REQUEST;
      const message =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при отправке подтверждения';

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }

  @Get('verify')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      const user = await this.mailService.verifyEmail(token);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Почтовый адрес успешно подтвержден',
        user: {
          email: user.email,
          verified: user.verifiedEmail,
        },
      });
    } catch (error: unknown) {
      const status =
        error instanceof Error && 'status' in error
          ? (error as { status: number }).status
          : HttpStatus.BAD_REQUEST;
      const message =
        error instanceof Error
          ? error.message
          : 'Неизвестная ошибка при подтверждении почты';

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }
}
