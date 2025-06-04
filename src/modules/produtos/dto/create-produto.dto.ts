import { IsString, IsOptional } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsString()
  imagem_base64: string;
} 
