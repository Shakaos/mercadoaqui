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
exports.MercadoController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mercado_entity_1 = require("./mercado.entity");
const create_mercado_dto_1 = require("./dto/create-mercado.dto");
const update_mercado_dto_1 = require("./dto/update-mercado.dto");
const preco_entity_1 = require("../admin/preco.entity");
let MercadoController = class MercadoController {
    mercadoRepo;
    precoRepo;
    constructor(mercadoRepo, precoRepo) {
        this.mercadoRepo = mercadoRepo;
        this.precoRepo = precoRepo;
    }
    async listarTodos() {
        return this.mercadoRepo.find();
    }
    async criar(body) {
        const novo = this.mercadoRepo.create(body);
        return this.mercadoRepo.save(novo);
    }
    async buscarPorId(id) {
        return this.mercadoRepo.findOne({ where: { id: Number(id) } });
    }
    async editar(id, body) {
        await this.mercadoRepo.update(id, body);
        return this.mercadoRepo.findOne({ where: { id: Number(id) } });
    }
    async remover(id) {
        await this.mercadoRepo.delete(id);
        return { message: 'Mercado removido com sucesso' };
    }
    async listarPrecosPorProduto(produtoId) {
        return this.precoRepo.find({
            where: { produto: { id: Number(produtoId) } },
            relations: ['mercado', 'produto'],
        });
    }
};
exports.MercadoController = MercadoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MercadoController.prototype, "listarTodos", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mercado_dto_1.CreateMercadoDto]),
    __metadata("design:returntype", Promise)
], MercadoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MercadoController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_mercado_dto_1.UpdateMercadoDto]),
    __metadata("design:returntype", Promise)
], MercadoController.prototype, "editar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MercadoController.prototype, "remover", null);
__decorate([
    (0, common_1.Get)('/precos/:produtoId'),
    __param(0, (0, common_1.Param)('produtoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MercadoController.prototype, "listarPrecosPorProduto", null);
exports.MercadoController = MercadoController = __decorate([
    (0, common_1.Controller)('mercados'),
    __param(0, (0, typeorm_1.InjectRepository)(mercado_entity_1.Mercado)),
    __param(1, (0, typeorm_1.InjectRepository)(preco_entity_1.Preco)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MercadoController);
//# sourceMappingURL=mercado.controller.js.map