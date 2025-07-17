import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: () => {
        if (!process.env.SMTP_SERVER || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
          throw new Error('SMTP configuration is missing');
        }

        return nodemailer.createTransport({
          host: process.env.SMTP_SERVER,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
      },
    },
    MailService,
  ],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}