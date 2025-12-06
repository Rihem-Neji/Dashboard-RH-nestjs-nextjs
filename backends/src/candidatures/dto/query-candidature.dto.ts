import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class QueryCandidatureDto {
  @IsOptional()
  @IsEnum(['submitted', 'pending', 'accepted', 'rejected'] as const)
  status?: 'submitted' | 'pending' | 'accepted' | 'rejected';

  @IsOptional()
  @IsMongoId()
  id_offre?: string;
}
