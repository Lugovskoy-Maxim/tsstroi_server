import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private handleError(error: unknown, defaultMessage: string) {
    if (error instanceof HttpException) throw error;
    throw new HttpException(defaultMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Получить данные текущего пользователя
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    try {
      const user = await this.usersService.findById(req.user.sub);
      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      this.handleError(error, 'Не удалось получить данные пользователя');
    }
  }

  // Получить всех пользователей (только для админов)
  @Get('all')
  @Roles('admin')
  async getAllUsers() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      this.handleError(error, 'Не удалось получить список пользователей');
    }
  }

  // Получить данные любого пользователя
  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      this.handleError(error, 'Ошибка при получении пользователя');
    }
  }

  // Обновить данные пользователя
  @Put(':id')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.updateProfile(
        req.user.sub,
        updateUserDto,
        req.user,
      );
    } catch (error) {
      this.handleError(error, 'Не удалось обновить данные');
    }
  }

  // Удалить профиль
  @Delete(':id')
  async deleteProfile(@Req() req: RequestWithUser) {
    try {
      const deletedUser = await this.usersService.delete(req.user.sub, req.user);
      if (!deletedUser) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      return { message: 'Профиль успешно удален' };
    } catch (error) {
      this.handleError(error, 'Не удалось удалить профиль');
    }
  }
}