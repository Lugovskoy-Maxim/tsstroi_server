import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from './organization.schema';

@Schema({ timestamps: true })
export class ConstructionSite extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: false,
  })
  location: {
    lat: number;
    lng: number;
  };

  @Prop({
    type: String,
    required: true,
    maxlength: 255,
  })
  address: string;

  @Prop({
    type: String,
    required: false,
    maxlength: 500,
    default: '',
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    enum: ['active', 'planned', 'completed', 'suspended'],
    default: 'active',
  })
  status: string;

  @Prop({
    type: Date,
    required: true,
    index: true,
  })
  DateStart: Date;

  @Prop({
    type: Date,
    required: false,
    index: true,
  })
  DateEnd: Date;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Vehicle',
      },
    ],
    default: [],
  })
  vehicles: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Personal',
      },
    ],
    default: [],
  })
  admPersonal: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
    required: false,
  })
  organization: Organization;

  @Prop({
    type: String,
    required: true,
    enum: ['open', 'restricted', 'closed'],
    default: 'open',
  })
  accessType: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;
}
export type ConstructionSiteDocument = ConstructionSite & Document;
export const ConstructionSiteSchema =
  SchemaFactory.createForClass(ConstructionSite);

ConstructionSiteSchema.index({ location: '2dsphere' });
ConstructionSiteSchema.index({ status: 1 });
ConstructionSiteSchema.index({ organization: 1 });
ConstructionSiteSchema.index({ vehicles: 1 });
