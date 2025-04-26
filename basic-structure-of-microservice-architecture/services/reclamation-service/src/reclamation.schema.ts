import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReclamationDocument = Reclamation & Document;

@Schema({ timestamps: true })
export class Reclamation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  description: string;
}

export const ReclamationSchema = SchemaFactory.createForClass(Reclamation);
