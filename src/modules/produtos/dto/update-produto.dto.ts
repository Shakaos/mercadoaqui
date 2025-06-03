import { IsString, IsOptional } from 'class-validator';

export class UpdateProdutoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
} 