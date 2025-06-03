import { IsString } from 'class-validator';

export class CreateMercadoDto {
  @IsString()
  nome: string;

  @IsString()
  endereco: string;
} 