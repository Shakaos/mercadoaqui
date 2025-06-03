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
exports.ProdutoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const produto_entity_1 = require("./produto.entity");
const preco_entity_1 = require("../admin/preco.entity");
const mercado_entity_1 = require("../admin/mercado.entity");
let ProdutoService = class ProdutoService {
    produtoRepo;
    precoRepo;
    mercadoRepo;
    constructor(produtoRepo, precoRepo, mercadoRepo) {
        this.produtoRepo = produtoRepo;
        this.precoRepo = precoRepo;
        this.mercadoRepo = mercadoRepo;
    }
    async listarTodos() {
        return this.produtoRepo.find();
    }
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
};
exports.ProdutoService = ProdutoService;
exports.ProdutoService = ProdutoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(produto_entity_1.Produto)),
    __param(1, (0, typeorm_1.InjectRepository)(preco_entity_1.Preco)),
    __param(2, (0, typeorm_1.InjectRepository)(mercado_entity_1.Mercado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProdutoService);
//# sourceMappingURL=produto.service.js.map