import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document & {
  _id: Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret: Record<string, any>) => { 
      ['password', 'emailVerificationToken', 'emailVerificationExpires', 
        'passwordResetToken', 'passwordResetExpires'].forEach(field => {
        delete ret[field];
      });
      return ret;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
    index: true
  })
  login: string;

  @Prop({
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: (v: string) => /.+@.+\..+/.test(v),
      message: 'Некорректный email'
    }
  })
  email?: string;

  @Prop({
    type: String,
    required: true,
    select: false,
    minlength: 8,
    validate: {
      validator: (v: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v),
      message: 'Пароль должен содержать минимум 8 символов, включая заглавные буквы и цифры'
    }
  })
  password: string;

  @Prop({ type: String, trim: true, maxlength: 50 })
  firstName?: string;

  @Prop({ type: String, trim: true, maxlength: 50 })
  lastName?: string;

  @Prop({ type: Boolean, default: false })
  verifiedEmail: boolean;

  @Prop({ type: String, select: false })
  emailVerificationToken?: string;

  @Prop({ type: Date, select: false })
  emailVerificationExpires?: Date;

  @Prop({ type: String, select: false })
  passwordResetToken?: string;

  @Prop({ type: Date, select: false })
  passwordResetExpires?: Date;

  @Prop({ type: String, match: /^\+?[0-9]{10,15}$/, default: null })
  phoneNumber?: string | null;

  @Prop({ type: Boolean, default: false })
  verifiedPhone?: boolean;

  @Prop({ 
    type: Date,
    validate: {
      validator: (v: Date) => v < new Date(),
      message: 'Дата рождения не может быть в будущем'
    }
  })
  birthday?: Date;

  @Prop({ type: String, match: /^(https?:\/\/).+\.(jpg|jpeg|png|gif|webp)$/i })
  avatar?: string;

  @Prop({ type: String, enum: ['male', 'female', null], default: null })
  sex?: 'male' | 'female' | null;

  @Prop({
    type: [String],
    default: ['user'],
    enum: ['user', 'admin', 'moderator'],
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'Пользователь должен иметь хотя бы одну роль'
    }
  })
  roles: string[];

  @Prop({ type: Boolean, default: false })
  isBanned: boolean;

  @Prop({ type: String })
  banReason?: string;

  @Prop({ type: Date, index: true, default: Date.now })
  lastActiveAt: Date;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ roles: 1, isBanned: 1 });
UserSchema.index({ verifiedEmail: 1, verifiedPhone: 1 });