import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    register(body: CreateUsuarioDto): Promise<{
        id: number;
        nome: string;
        email: string;
    }>;
    login(body: {
        email: string;
        senha: string;
    }): Promise<{
        token: string;
        usuario: {
            id: number;
            nome: string;
            email: string;
        };
    }>;
    atualizar(body: {
        id: number;
        nome: string;
        email: string;
    }): Promise<{
        message: string;
    }>;
    excluir(id: string): Promise<{
        message: string;
    }>;
    listarTodos(): Promise<import("./usuario.entity").Usuario[]>;
    buscarPorId(id: string): Promise<import("./usuario.entity").Usuario>;
    atualizarPorId(id: string, body: UpdateUsuarioDto): Promise<{
        message: string;
    }>;
    remover(id: string): Promise<{
        message: string;
    }>;
}
