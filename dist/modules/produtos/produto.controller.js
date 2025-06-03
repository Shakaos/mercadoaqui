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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const produto_entity_1 = require("./produto.entity");
const preco_entity_1 = require("../admin/preco.entity");
const create_produto_dto_1 = require("./dto/create-produto.dto");
const update_produto_dto_1 = require("./dto/update-produto.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ProdutoController = class ProdutoController {
    produtoRepo;
    precoRepo;
    constructor(produtoRepo, precoRepo) {
        this.produtoRepo = produtoRepo;
        this.precoRepo = precoRepo;
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
    async criar(body) {
        const novo = this.produtoRepo.create(body);
        return this.produtoRepo.save(novo);
    }
    async buscarPorId(id) {
        return this.produtoRepo.findOne({ where: { id: Number(id) } });
    }
    async editar(id, body) {
        await this.produtoRepo.update(id, body);
        return this.produtoRepo.findOne({ where: { id: Number(id) } });
    }
    async remover(id) {
        await this.produtoRepo.delete(id);
        return { message: 'Produto removido com sucesso' };
    }
    async listarPorMercado(mercadoId) {
        return this.produtoRepo
            .createQueryBuilder('produto')
            .innerJoin('precos', 'preco', 'preco.produto_id = produto.id')
            .where('preco.mercado_id = :mercadoId', { mercadoId })
            .getMany();
    }
    async uploadImagem(file) {
        return { filename: file.filename, path: file.path };
    }
};
exports.ProdutoController = ProdutoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "listarTodos", null);
__decorate([
    (0, common_1.Get)('com-precos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "listarComPrecos", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_produto_dto_1.CreateProdutoDto]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_produto_dto_1.UpdateProdutoDto]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "editar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "remover", null);
__decorate([
    (0, common_1.Get)('/mercado/:mercadoId'),
    __param(0, (0, common_1.Param)('mercadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "listarPorMercado", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/^image\//)) {
                return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "uploadImagem", null);
exports.ProdutoController = ProdutoController = __decorate([
    (0, common_1.Controller)('produtos'),
    __param(0, (0, typeorm_1.InjectRepository)(produto_entity_1.Produto)),
    __param(1, (0, typeorm_1.InjectRepository)(preco_entity_1.Preco)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProdutoController);
//# sourceMappingURL=produto.controller.js.map