import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { Preco } from '../admin/preco.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
export declare class ProdutoController {
    private produtoRepo;
    private precoRepo;
    constructor(produtoRepo: Repository<Produto>, precoRepo: Repository<Preco>);
    listarTodos(): Promise<Produto[]>;
    listarComPrecos(): Promise<{
        id: number;
        nome: string;
        categoria: string;
        tipo: string;
        preco: number;
        mercado: string;
    }[]>;
    criar(body: CreateProdutoDto): Promise<Produto>;
    buscarPorId(id: string): Promise<Produto | null>;
    editar(id: string, body: UpdateProdutoDto): Promise<Produto | null>;
    remover(id: string): Promise<{
        message: string;
    }>;
    listarPorMercado(mercadoId: string): Promise<Produto[]>;
    uploadImagem(file: Express.Multer.File): Promise<{
        filename: any;
        path: any;
    }>;
}
