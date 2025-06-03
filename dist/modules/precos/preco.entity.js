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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preco = void 0;
const typeorm_1 = require("typeorm");
const produto_entity_1 = require("../produtos/produto.entity");
const mercado_entity_1 = require("../mercados/mercado.entity");
let Preco = class Preco {
    id;
    produto;
    mercado;
    preco;
    atualizado_em;
};
exports.Preco = Preco;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Preco.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => produto_entity_1.Produto),
    (0, typeorm_1.JoinColumn)({ name: 'produto_id' }),
    __metadata("design:type", produto_entity_1.Produto)
], Preco.prototype, "produto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mercado_entity_1.Mercado),
    (0, typeorm_1.JoinColumn)({ name: 'mercado_id' }),
    __metadata("design:type", mercado_entity_1.Mercado)
], Preco.prototype, "mercado", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Preco.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Preco.prototype, "atualizado_em", void 0);
exports.Preco = Preco = __decorate([
    (0, typeorm_1.Entity)('precos')
], Preco);
//# sourceMappingURL=preco.entity.js.map