import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { Preco } from '../precos/preco.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../usuarios/jwt-auth.guard';
import { Mercado } from '../mercados/mercado.entity';

@Controller('produtos')
export class ProdutoController {
  constructor(
    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,
    @InjectRepository(Preco)
    private precoRepo: Repository<Preco>,
    @InjectRepository(Mercado)
    private mercadoRepo: Repository<Mercado>,
  ) {}

  @Get('com-precos') // Coloque essa rota ANTES do ':id'
  async listarComPrecos() {
    const produtos = await this.produtoRepo.find();
    const precos = await this.precoRepo.find({ relations: ['produto', 'mercado'] });

    return produtos.map(prod => {
      const relacionados = precos.filter(p => p.produto.id === prod.id);
      const menorPreco = relacionados.sort((a, b) => a.valor - b.valor)[0];

      return {
        id: prod.id,
        nome: prod.nome,
        categoria: prod.categoria,
        tipo: prod.tipo,
        preco: menorPreco?.valor ?? null,
        mercado: menorPreco?.mercado ? {
          id: menorPreco.mercado.id,
          nome: menorPreco.mercado.nome
        } : null,
      };
    });
  }

  @Get()
  async listarTodos() {
    return this.produtoRepo.find({ relations: ['mercado'] });
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('ID inválido');
    }

    const produto = await this.produtoRepo.findOne({ where: { id: idNum }, relations: ['mercado'] });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async criar(@Body() body: CreateProdutoDto) {
    const { mercado_id, ...dados } = body;

    const mercado = await this.mercadoRepo.findOne({ where: { id: mercado_id } });
    if (!mercado) {
      throw new NotFoundException('Mercado não encontrado');
    }

    const novo = this.produtoRepo.create({ ...dados, mercado });
    return this.produtoRepo.save(novo);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async editar(@Param('id') id: string, @Body() body: UpdateProdutoDto) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('ID inválido');
    }

    await this.produtoRepo.update(idNum, body);
    return this.produtoRepo.findOne({ where: { id: idNum } });
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('ID inválido');
    }

    await this.produtoRepo.delete(idNum);
    return { message: 'Produto removido com sucesso' };
  }

  @Get('/mercado/:mercadoId')
  async listarPorMercado(@Param('mercadoId') mercadoId: string) {
    return this.produtoRepo
      .createQueryBuilder('produto')
      .innerJoin('precos', 'preco', 'preco.produto_id = produto.id')
      .where('preco.mercado_id = :mercadoId', { mercadoId })
      .getMany();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImagem(@UploadedFile() file: any) {
    return { filename: file.filename, path: file.path };
  }
}
