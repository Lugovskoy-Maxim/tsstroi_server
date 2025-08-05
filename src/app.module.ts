import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { VehiclesModule } from './vehicles/vehicle.module';
import { OrganizationModule } from './organizations/organization.module';
import { DriverModule } from './drivers/driver.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '7d' }, 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    VehiclesModule,
    OrganizationModule,
    DriverModule,
    // MailModule, // пока не работает хз почему 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
