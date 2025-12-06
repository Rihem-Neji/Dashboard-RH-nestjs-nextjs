import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CandidatureDocument = Candidature & Document;

@Schema({ timestamps: true })
export class Candidature {
  
  @Prop({ required: true, trim: true }) nom: string;
  @Prop({ required: true, trim: true }) prenom: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  // URL du CV, ou nom de fichier (upload plus tard si tu veux)
  //@Prop({ required: true, trim: true })
  //CV: string;

  // --- Infos CV uploadé ---
  @Prop({ trim: true }) cvUrl?: string;           // ex: "/uploads/cv/xxx.pdf"
  @Prop({ trim: true }) cvOriginalName?: string;  // ex: "monCV.pdf"
  @Prop({ trim: true }) cvMimeType?: string;      // "application/pdf"
  @Prop() cvSize?: number;                         // en octets


  @Prop({
    required: true,
    enum: ['submitted', 'pending', 'accepted', 'rejected'],
    default: 'submitted',
  })
  status: 'submitted' | 'pending' | 'accepted' | 'rejected';

  // Référence à l'offre (ObjectId Mongo)
  @Prop({ type: Types.ObjectId, ref: 'Offer', required: true })
  id_offre: Types.ObjectId;
}

export const CandidatureSchema = SchemaFactory.createForClass(Candidature);

// Un même email ne peut pas postuler 2 fois à la même offre
CandidatureSchema.index({ email: 1, id_offre: 1 }, { unique: true });
