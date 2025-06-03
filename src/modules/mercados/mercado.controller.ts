import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mercado } from './mercado.entity';
import { CreateMercadoDto } from './dto/create-mercado.dto';
import { UpdateMercadoDto } from './dto/update-mercado.dto';
import { Preco } from '../precos/preco.entity';

@Controller('mercados')
export class MercadoController {
  constructor(
    @InjectRepository(Mercado)
    private mercadoRepo: Repository<Mercado>,
    @InjectRepository(Preco)
    private precoRepo: Repository<Preco>,
  ) {}

  @Get()
  async listarTodos() {
    return this.mercadoRepo.find();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async criar(@Body() body: CreateMercadoDto) {
    const novo = this.mercadoRepo.create(body);
    return this.mercadoRepo.save(novo);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.mercadoRepo.findOne({ where: { id: Number(id) } });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async editar(@Param('id') id: string, @Body() body: UpdateMercadoDto) {
    await this.mercadoRepo.update(id, body);
    return this.mercadoRepo.findOne({ where: { id: Number(id) } });
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    await this.mercadoRepo.delete(id);
    return { message: 'Mercado removido com sucesso' };
  }

  @Get('/precos/:produtoId')
  async listarPrecosPorProduto(@Param('produtoId') produtoId: string) {
    return this.precoRepo.find({
      where: { produto: { id: Number(produtoId) } },
      relations: ['mercado', 'produto'],
    });
  }
} 