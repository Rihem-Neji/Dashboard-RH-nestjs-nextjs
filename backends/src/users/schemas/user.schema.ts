import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      delete ret.password; // <-- masque le password dans toutes les réponses JSON
      return ret;
    },
     versionKey: false, // optionnel: enlève __v
     virtuals: true,
  },
})
export class User extends Document {
  @Prop({ required: true , trim: true })
  first_name: string;

   @Prop({ required: true , trim: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true , select: false})
  password: string;

  @Prop({ default: 'user' , enum: ['RH', 'admin','user'] })
  role: string;

  @Prop() avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
