import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true, versionKey: false })
export class Driver extends Document {
  @Prop({ type: String, required: true, trim: true })
  fullName: string;

  @Prop({ type: String, required: true, unique: true })
  licenseNumber: string;

  @Prop({
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'BE', 'CE', 'DE'],
  })
  licenseCategory: string;

  @Prop({ type: Date, required: true })
  licenseExpiry: Date;

  @Prop({ type: String, required: true, match: /^\+7\d{10}$/ })
  phone: string;

  @Prop({ type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
  email: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Date, required: true })
  birthDate: Date;

  @Prop({ type: String })
  organization: string;

  @Prop({
    type: String,
    enum: ['active', 'suspended', 'fired', 'vacation'],
    default: 'active',
  })
  status: string;

  @Prop({ type: Date })
  hiredDate: Date;

  @Prop({ type: Date })
  firedDate: Date;

  @Prop({ type: String })
  notes: string;

  // Поля для пропусков
  @Prop({
    type: {
      number: String,
      issueDate: Date,
      expiryDate: Date,
      constructionSite: { type: Types.ObjectId, ref: 'ConstructionSite' },
    },
    required: false,
  })
  workPass?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    constructionSite: Types.ObjectId;
  };

  // Медицинский осмотр
  @Prop({
    type: {
      certificateNumber: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expiryDate: { type: Date, required: true },
      clinic: { type: String },
    },
    required: false,
  })
  medicalExam: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    clinic?: string;
  };

  // Психологический осмотр
  @Prop({
    type: {
      certificateNumber: { type: String, required: true },
      issueDate: { type: Date, required: true },
      expiryDate: { type: Date, required: true },
      center: { type: String },
    },
    required: false,
  })
  psychologicalExam: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    center?: string;
  };

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
export type DriverDocument = Driver & Document;
// Индексы для быстрого поиска
DriverSchema.index({ fullName: 'text' });
DriverSchema.index({ status: 1 });
