import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { JwtService } from '@nestjs/jwt';
export declare class UsuariosService {
    private readonly usuariosRepo;
    private readonly jwtService;
    constructor(usuariosRepo: Repository<Usuario>, jwtService: JwtService);
    autenticar(email: string, senha: string): Promise<{
        token: string;
        usuario: {
            id: number;
            nome: string;
            email: string;
        };
    }>;
    registrar(nome: string, email: string, senha: string): Promise<{
        id: number;
        nome: string;
        email: string;
    }>;
    atualizarPerfil(id: number, nome?: string, email?: string): Promise<{
        message: string;
    }>;
    deletarConta(id: number): Promise<{
        message: string;
    }>;
    listarTodos(): Promise<Usuario[]>;
    buscarPorId(id: number): Promise<Usuario>;
}
