import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema()
export class Offer {
  // id_offre : identifiant lisible (différent du _id Mongo). Optionnel.
  @Prop({ unique: true, sparse: true, trim: true })
  id_offre?: string;

  @Prop({ required: true, trim: true })
  titre: string;

  @Prop({ required: true, trim: true })
  description: string;

  // date de l’offre
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, trim: true, enum: ['active', 'archived'] })
  status_offre: 'active' | 'archived';
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
