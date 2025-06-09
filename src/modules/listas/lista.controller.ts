
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Lista } from './lista.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { ItemLista } from './item-lista.entity';
import { Produto } from '../produtos/produto.entity';
import { Preco } from '../precos/preco.entity';
import { Mercado } from '../mercados/mercado.entity';

function parsePreco(valor: string | number): number {
  if (typeof valor === 'string') {
    // Remove símbolo R$ e espaços
    const limpo = valor.replace('R$', '').trim();

    // Se tiver vírgula como separador decimal (ex: 30,90)
    if (limpo.includes(',')) {
      return parseFloat(limpo.replace('.', '').replace(',', '.')) || 0;
    }

    // Se já estiver no formato correto com ponto decimal (ex: 30.90)
    return parseFloat(limpo) || 0;
  }

  return Number(valor) || 0;
}

@Controller('historico')
export class ListaController {
  constructor(
    @InjectRepository(Lista)
    private readonly listaRepo: Repository<Lista>,

    @InjectRepository(ItemLista)
    private readonly itemListaRepo: Repository<ItemLista>,

    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,

    @InjectRepository(Preco)
    private readonly precoRepo: Repository<Preco>,

    @InjectRepository(Mercado)
    private readonly mercadoRepo: Repository<Mercado>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Get()
  async listarHistorico() {
    return this.listaRepo.find({
      relations: ['usuario', 'mercado'],
      order: { criada_em: 'DESC' },
    });
  }

  @Get(':id')
  async obterDetalhes(@Param('id') id: number) {
    const lista = await this.listaRepo.findOne({
      where: { id },
      relations: ['usuario', 'mercado'],
    });

    if (!lista) return { error: 'Lista não encontrada' };

    const itens = await this.itemListaRepo.find({
      where: { lista: { id } },
      relations: ['produto'],
    });

    return {
      lista: {
        id: lista.id,
        nome: lista.nome,
        mercado: lista.mercado?.nome,
        criada_em: lista.criada_em,
        total: lista.total,
      },
      produtos: itens.map(item => ({
        id: item.produto.id,
        nome: item.produto.nome,
        quantidade: item.quantidade || 1,
      })),
    };
  }

  @Post('/comparar')
async compararListas(@Body() body: { produtos: number[]; nome?: string }) {
  const { produtos, nome } = body;

  if (!produtos || produtos.length === 0) {
    return [];
  }

  const precos = await this.precoRepo.find({
    where: { produto: { id: In(produtos) } },
    relations: ['produto', 'mercado'],
  });

  const mercadosMap: Record<
    string,
    { total: number; produtos: Preco[] }
  > = {};

  for (const preco of precos) {
    const nomeMercado = preco.mercado.nome;

    if (!mercadosMap[nomeMercado]) {
      mercadosMap[nomeMercado] = { total: 0, produtos: [] };
    }

    const valorNumerico = parsePreco(preco.valor);
    mercadosMap[nomeMercado].produtos.push(preco);
    mercadosMap[nomeMercado].total += valorNumerico;
  }

  const entradaOrdenada = Object.entries(mercadosMap)
    .filter(([_, dados]) => dados.total > 0)
    .sort((a, b) => a[1].total - b[1].total);

  if (entradaOrdenada.length === 0) {
    return [];
  }

  const [mercadoVencedorNome, dados] = entradaOrdenada[0];

  const mercado = await this.mercadoRepo.findOne({
    where: { nome: mercadoVencedorNome },
  });

  if (!mercado) {
    return { error: 'Mercado não encontrado' };
  }

  const novaLista = this.listaRepo.create({
    nome: nome || `Comparação - ${new Date().toLocaleString('pt-BR')}`,
    mercado,
    criada_em: new Date(),
    total: parsePreco(dados.total),
    usuario, 
  });

  const listaSalva = await this.listaRepo.save(novaLista);

  const itens = dados.produtos.map((preco) =>
    this.itemListaRepo.create({
      lista: listaSalva,
      produto: preco.produto,
      quantidade: 1,
    })
  );

  await this.itemListaRepo.save(itens);

  return entradaOrdenada.map(([nomeMercado, dados]) => ({
    mercado: nomeMercado,
    total: parsePreco(dados.total),
    produtos: dados.produtos.map(p => ({
      nome: p.produto.nome,
      preco: parsePreco(p.valor),
      })),
    }));
  }
}
