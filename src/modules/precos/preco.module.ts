import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preco } from './preco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Preco])],
  exports: [TypeOrmModule],
})
export class PrecoModule {}