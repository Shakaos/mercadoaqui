import { IsString, IsOptional, IsNumber } from 'class-validator';

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

  @IsNumber()
  mercado_id: number; // deve bater com o nome desestruturado no controller
}
