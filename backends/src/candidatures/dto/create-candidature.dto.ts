import { IsEmail, IsEnum,IsOptional,IsIn , IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateCandidatureDto {
  @IsMongoId()@IsNotEmpty() id_offre: string;
  @IsString() @IsNotEmpty() nom: string;
  @IsString() @IsNotEmpty() prenom: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsOptional()
  @IsIn(['submitted','pending','accepted','rejected'])
  status?: 'submitted'|'pending'|'accepted'|'rejected';
  //@IsString() @IsNotEmpty() CV: string;  // URL du CV
  //@IsEnum(['submitted', 'in_review', 'accepted', 'rejected'] as const)
  //status?: 'submitted' | 'in_review' | 'accepted' | 'rejected'; // optionnel à la création
  //@IsMongoId() id_offre: string; // _id Mongo de l'offre
}
