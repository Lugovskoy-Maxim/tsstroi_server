import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Создание нового пользователя
  async create(createUserDto: RegisterUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  // Поиск по логину или email
  async findOneByLoginOrEmail(login: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ login }, { email: login }],
      })
      .select('+password')
      .exec();
  }

  // Поиск только по логину
  async findOneByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login });
  }

  // Поиск по ID
  async findById(userId: string): Promise<User | null> {
    if (!userId) {
      return null;
    }
    return this.userModel.findById(userId).select('-password').exec();
  }

  // Получение всех пользователей (с пагинацией)
  async findAll(
    skip = 0,
    limit = 10,
  ): Promise<{ users: User[]; count: number }> {
    const [users, count] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).select('-password').exec(),
      this.userModel.countDocuments().exec(),
    ]);
    return { users, count };
  }

  // Обновление пользователя
  async updateProfile(
    userId: string,
    updateData: UpdateUserDto,
    currentUser: { login?: string; roles?: string[]; sub: string },
  ): Promise<User> {
    // Проверка прав доступа
    if (
      currentUser.sub.toString() !== userId &&
      !currentUser.roles?.includes('admin')
    ) {
      throw new ForbiddenException('Вы можете обновлять только свой профиль');
    }

    // Только администратор может изменять роли
    if (updateData.roles && !currentUser.roles?.includes('admin')) {
      throw new ForbiddenException('Только администратор может изменять роли');
    }

    // Запрет на изменение ролей самого себя (если не админ)
    if (updateData.roles && currentUser.sub.toString() === userId) {
      throw new ForbiddenException(
        'Вы не можете изменять свои собственные роли',
      );
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    return updatedUser;
  }

  // Удаление пользователя
  async delete(
    userId: string,
    currentUser: { sub: string; roles?: string[] },
  ): Promise<User> {
    // Проверка прав доступа: только свой аккаунт или админ
    if (currentUser.sub !== userId && !currentUser.roles?.includes('admin')) {
      throw new ForbiddenException('Вы можете удалить только свой профиль');
    }

    // Админ не может удалить свой аккаунт
    if (currentUser.sub === userId && !currentUser.roles?.includes('admin')) {
      throw new ForbiddenException('Вы не можете удалить свой аккаунт');
    }

    const deletedUser = await this.userModel
      .findByIdAndDelete(userId)
      .select('-password')
      .exec();

    if (!deletedUser) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    return deletedUser;
  }

  // Поиск по email (ваш существующий метод)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  // Обновление пароля
  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true },
    );
  }

  // Получение общего количества пользователей
  async getTotalCount(): Promise<number> {
    try {
      return await this.userModel.countDocuments().exec();
    } catch (error) {
      throw new Error('Ошибка при получении общего количества пользователей');
    }
  }

  // Получение количества активных пользователей (с примером критерия активности)
  async getActiveCount(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date(
        new Date().setDate(new Date().getDate() - 30),
      );

      const activeUsers = await this.userModel
        .find({
          lastActiveAt: { $gte: thirtyDaysAgo },
        })
        .select('_id lastActiveAt')
        .lean();
      return activeUsers.length;
    } catch (error) {
      throw new Error('Ошибка при получении количества активных пользователей');
    }
  }
}
