import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Transporter } from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private readonly emailTemplates: Record<string, handlebars.TemplateDelegate>;

  constructor(
    @Inject('MAIL_TRANSPORTER') private readonly transporter: Transporter,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {
    // Initialize templates on service creation
    this.emailTemplates = {
      verification: this.compileTemplate('email-verification'),
    };
  }

private compileTemplate(templateName: string): handlebars.TemplateDelegate {
    try {
      const templatePath = join(__dirname, 'templates', `${templateName}.hbs`);
      const templateSource = readFileSync(templatePath, 'utf8');
      return handlebars.compile(templateSource);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to compile template ${templateName}: ${err.message}`);
      }
      throw new Error(`Failed to compile template ${templateName}: Unknown error`);
    }
}

  private async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  private async createEmailVerificationToken(email: string): Promise<string> {
    if (!process.env.EMAIL_VERIFICATION_SECRET) {
      throw new Error('EMAIL_VERIFICATION_SECRET is not defined');
    }

    const token = this.jwtService.sign(
      { email },
      {
        expiresIn: '24h',
        secret: process.env.EMAIL_VERIFICATION_SECRET,
      },
    );

    await this.userModel.findOneAndUpdate(
      { email },
      {
        emailVerificationToken: token,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    );

    return token;
  }

  async sendVerificationById(userId: string): Promise<{ email: string }> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.email) {
      throw new BadRequestException('Email is not specified');
    }

    if (user.verifiedEmail) {
      throw new BadRequestException('Email is already verified');
    }

    await this.sendVerificationEmail(user.email);

    return { email: user.email };
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verifiedEmail) {
      throw new BadRequestException('Email is already verified');
    }

    const token = await this.createEmailVerificationToken(email);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const html = this.emailTemplates.verification({
      name: user.firstName || "User",
      verificationUrl,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
      appName: process.env.APP_NAME || 'Our Service',
    });

    if (!this.transporter) {
      throw new Error('Mail transporter is not initialized');
    }

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 
           `"Support Service" <${process.env.SUPPORT_EMAIL || 'noreply@example.com'}>`,
      to: email,
      subject: `Email verification for ${process.env.APP_NAME || 'our service'}`,
      html,
    });
  }

  async verifyEmail(token: string): Promise<UserDocument> {
    if (!process.env.EMAIL_VERIFICATION_SECRET) {
      throw new Error('EMAIL_VERIFICATION_SECRET is not defined');
    }

    let payload: { email: string };
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.EMAIL_VERIFICATION_SECRET,
      });
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userModel.findOneAndUpdate(
      {
        email: payload.email,
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
      },
      {
        $set: { verifiedEmail: true },
        $unset: {
          emailVerificationToken: 1,
          emailVerificationExpires: 1,
        },
      },
      { new: true },
    );

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    return user;
  }
}