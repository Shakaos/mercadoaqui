import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CestaBasica } from './cesta.entity';
import { Mercado } from '../mercados/mercado.entity';
import { JwtAuthGuard } from '../usuarios/jwt-auth.guard';
import { Roles } from '../usuarios/roles.decorator';
import { CestaProduto } from './cesta_produto.entity';

@Controller('cestas')
export class CestaController {
  constructor(
    @InjectRepository(CestaBasica)
    private cestaRepo: Repository<CestaBasica>,
    @InjectRepository(Mercado)
    private mercadoRepo: Repository<Mercado>,
    @InjectRepository(CestaProduto)
    private cestaProdutoRepo: Repository<CestaProduto>,
  ) {}

  @Get()
  async listarCestas() {
    return this.cestaRepo.find({ relations: ['mercado', 'produtos'] });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async criarCesta(@Body() body: { mercadoId: number, produtos: { produtoId: number, preco: number, quantidade?: number }[] }) {
    const { mercadoId, produtos } = body;
    const mercado = await this.mercadoRepo.findOne({ where: { id: mercadoId } });
    if (!mercado) throw new Error('Mercado não encontrado');
    const cesta = this.cestaRepo.create({ mercado, data_atualizacao: new Date(), preco_total: 0 });
    const cestaSalva = await this.cestaRepo.save(cesta);
    let precoTotal = 0;
    for (const item of produtos) {
      const cestaProduto = new CestaProduto();
      cestaProduto.cesta = cestaSalva;
      cestaProduto.produto = { id: item.produtoId } as any;
      cestaProduto.preco = item.preco;
      cestaProduto.quantidade = item.quantidade ?? 1;
      precoTotal += item.preco * cestaProduto.quantidade;
      await this.cestaProdutoRepo.save(cestaProduto);
    }
    cestaSalva.preco_total = precoTotal;
    await this.cestaRepo.save(cestaSalva);
    return { message: 'Cesta criada com sucesso', id: cestaSalva.id };
  }
} 
