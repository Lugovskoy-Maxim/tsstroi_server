import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleDocument = Vehicle & Document & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const regNumberRegex =
  /^([0-9]\d{2,3}[A-Z]{2}\d{4}|[A-Z]\d{3}[A-Z]{2}\s?[0-9]\d{2,3})$/;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Vehicle extends Document {
  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regNumberRegex.test(v),
      message:
        'Неверно указан регистрационный номер, используйте формат: A123AA123 или 123AA1234',
    },
    unique: true,
  })
  registration_number: string;

  @Prop({ type: String, required: true })
  region_number: string;

  @Prop({ type: String, required: true })
  brand: string;

  @Prop({ type: String, required: true })
  brand_model: string;

  @Prop({
    type: String,
    required: true,
    uppercase: true, // сохранять в верхнем регистре
    match: /^[A-HJ-NPR-Z0-9]{17}$/, // базовая валидация VIN
  })
  VIN_number: string;

  @Prop({ type: String, required: true })
  organization: string;

  @Prop({ type: String, required: true })
  color: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  })
  year: number;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({
    type: String,
    required: true,
    enum: ['active', 'idle', 'repair'],
    default: 'active',
  })
  status: string;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ VIN_number: 1 }, { unique: true });
VehicleSchema.index({ status: 1 });
VehicleSchema.index({ organization: 1 });
