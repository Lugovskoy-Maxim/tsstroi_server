import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('statistics')
  async getStatistics() {
    try {
      return await this.appService.getGlobalStatistics();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Не удалось удалить профиль',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
