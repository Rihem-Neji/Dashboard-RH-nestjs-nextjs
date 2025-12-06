import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOfferDto {
  @IsOptional() @IsString()
  id_offre?: string;

  @IsString() @IsNotEmpty() @MinLength(3)
  titre: string;

  @IsString() @IsNotEmpty() @MinLength(10)
  description: string;

  // ISO 8601 (ex: "2025-08-11T10:00:00Z" ou "2025-08-11")
  @IsDateString()
  date: string;

  @IsString() @IsIn(['active', 'archived'])
  status_offre: 'active' | 'archived';
}
