import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe, UploadedFile, UseInterceptors, UseGuards, Put } from '@nestjs/common';
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
import { Roles } from '../usuarios/roles.decorator';

@Controller('produtos')
export class ProdutoController {
  constructor(
    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,
    @InjectRepository(Preco)
    private precoRepo: Repository<Preco>,
  ) {}

  @Get()
  async listarTodos() {
    return this.produtoRepo.find({ where: { aprovado: true } });
  }

  @Get('com-precos')
  async listarComPrecos() {
    const produtos = await this.produtoRepo.find();
    const precos = await this.precoRepo.find({ relations: ['produto', 'mercado'] });

    return produtos.map(prod => {
      const relacionados = precos.filter(p => p.produto.id === prod.id);
      const menorPreco = relacionados.sort((a, b) => a.preco - b.preco)[0];
      return {
        id: prod.id,
        nome: prod.nome,
        categoria: prod.categoria,
        tipo: prod.tipo,
        preco: menorPreco?.preco ?? null,
        mercado: menorPreco?.mercado?.nome ?? null
      };
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async criar(@Body() body: CreateProdutoDto) {
    const novo = this.produtoRepo.create({ ...body, aprovado: false });
    return this.produtoRepo.save(novo);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.produtoRepo.findOne({ where: { id: Number(id) } });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async editar(@Param('id') id: string, @Body() body: UpdateProdutoDto) {
    await this.produtoRepo.update(id, body);
    return this.produtoRepo.findOne({ where: { id: Number(id) } });
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    await this.produtoRepo.delete(id);
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
  @UseInterceptors(FileInterceptor('file', {
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
  }))
  async uploadImagem(@UploadedFile() file: any) {
    return { filename: file.filename, path: file.path };
  }

  @Get('pendentes')
  @UseGuards(JwtAuthGuard)
  @Roles('funcionario')
  async listarPendentes() {
    return this.produtoRepo.find({ where: { aprovado: false } });
  }

  @Put(':id/aprovar')
  @UseGuards(JwtAuthGuard)
  @Roles('funcionario')
  async aprovarProduto(@Param('id') id: string) {
    await this.produtoRepo.update(id, { aprovado: true });
    return { message: 'Produto aprovado com sucesso' };
  }
}
