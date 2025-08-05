import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { DriverSchema } from '../schemas/driver.schema';

@Module({
  imports: [
    // Подключаем модель Mongoose для драйверов
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema }])
  ],
  controllers: [DriverController], // Наш контроллер
  providers: [DriverService], // Сервис для бизнес-логики
  exports: [DriverService], // Экспортим сервис, если нужно использовать его в других модулях
})
export class DriverModule {}