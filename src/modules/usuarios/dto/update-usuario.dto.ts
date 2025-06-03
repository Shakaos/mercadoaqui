import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
} 