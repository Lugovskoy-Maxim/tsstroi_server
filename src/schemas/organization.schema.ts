import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vehicle } from './vehicle.schema';

export type OrganizationDocument = Organization &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Organization extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/, // ИНН
    message: 'ИНН должен состоять из 10 цифр',
  })
  inn: string;

  @Prop({
    type: String,
    required: true,
    match: /^\d{13}$/, // ОГРН
    message: 'ОГРН должен состоять из 13 цифр',
  })
  ogrn: string;

  @Prop({
    type: String,
    required: true,
    enum: ['LLC', 'JSC', 'IE', 'PE', 'OTHER'], // ООО, АО, ИП и др.
    default: 'LLC',
  })
  legalForm: string;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
    match: /^\+7\d{10}$/,
    message: 'Телефон должен быть в формате +7XXXXXXXXXX',
  })
  phone: string;

  @Prop({
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Некорректный email',
  })
  email: string;

  @Prop({
    type: String,
    required: false,
  })
  director: string;

  @Prop({
    type: String,
    required: false,
  })
  website: string;

    @Prop({
    type: {
      start: { type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
      end: { type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/ }
    },
    default: { start: '08:00', end: '20:00' }
  })
  workingHours: {
    start: string;
    end: string;
  };

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
    required: false,
  })
  deletedAt: Date;

  vehicles?: Vehicle[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.index({ name: 'text' }); // для поиска по названию
OrganizationSchema.index({ isActive: 1 });
