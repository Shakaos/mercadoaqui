"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let UsuariosService = class UsuariosService {
    usuariosRepo;
    jwtService;
    constructor(usuariosRepo, jwtService) {
        this.usuariosRepo = usuariosRepo;
        this.jwtService = jwtService;
    }
    async autenticar(email, senha) {
        const usuario = await this.usuariosRepo.findOne({ where: { email } });
        if (!usuario)
            throw new common_1.NotFoundException('Credenciais inválidas');
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida)
            throw new common_1.NotFoundException('Credenciais inválidas');
        const payload = { sub: usuario.id, email: usuario.email };
        const token = this.jwtService.sign(payload);
        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
        };
    }
    async registrar(nome, email, senha) {
        const existe = await this.usuariosRepo.findOne({ where: { email } });
        if (existe)
            throw new Error('Email já cadastrado');
        const hash = await bcrypt.hash(senha, 10);
        const novo = this.usuariosRepo.create({ nome, email, senha: hash });
        const salvo = await this.usuariosRepo.save(novo);
        return {
            id: salvo.id,
            nome: salvo.nome,
            email: salvo.email,
        };
    }
    async atualizarPerfil(id, nome, email) {
        const updateData = {};
        if (nome !== undefined)
            updateData.nome = nome;
        if (email !== undefined)
            updateData.email = email;
        await this.usuariosRepo.update(id, updateData);
        return { message: 'Perfil atualizado' };
    }
    async deletarConta(id) {
        const resultado = await this.usuariosRepo.delete(id);
        if (resultado.affected === 0)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return { message: 'Conta excluída com sucesso' };
    }
    async listarTodos() {
        return this.usuariosRepo.find();
    }
    async buscarPorId(id) {
        const usuario = await this.usuariosRepo.findOne({ where: { id } });
        if (!usuario)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return usuario;
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map