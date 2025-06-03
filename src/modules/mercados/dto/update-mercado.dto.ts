import { IsString, IsOptional } from 'class-validator';

export class UpdateMercadoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  endereco?: string;
} 