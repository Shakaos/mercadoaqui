import { IsString, IsOptional, IsInt } from 'class-validator';

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

  @IsInt()
  mercado_id: number; // 👈 novo campo obrigatório
}
