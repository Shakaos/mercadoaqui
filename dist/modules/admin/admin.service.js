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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AdminService = class AdminService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async resetarDadosMock() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            await queryRunner.query('DELETE FROM itens_lista');
            await queryRunner.query('DELETE FROM listas');
            await queryRunner.query('DELETE FROM avaliacoes');
            await queryRunner.query('DELETE FROM precos');
            await queryRunner.query('DELETE FROM cestas_basicas');
            await queryRunner.query('DELETE FROM produtos');
            await queryRunner.query('DELETE FROM mercados');
            await queryRunner.query('DELETE FROM usuarios');
            await queryRunner.query('ALTER TABLE produtos AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE mercados AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE usuarios AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE listas AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE itens_lista AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE precos AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE cestas_basicas AUTO_INCREMENT = 1');
            await queryRunner.query('ALTER TABLE avaliacoes AUTO_INCREMENT = 1');
            await queryRunner.query(`
        INSERT INTO usuarios (nome, email, senha, tipo) VALUES
        ('João Silva', 'joao@email.com', '$2b$10$1nGch8eN8lY9jA7WrsUO9eNHTUoTbcHGdyY6Xr3PaJ4Ov96aM1zxu', 'cliente'),
        ('Maria Souza', 'maria@email.com', '$2b$10$1nGch8eN8lY9jA7WrsUO9eNHTUoTbcHGdyY6Xr3PaJ4Ov96aM1zxu', 'cliente');
      `);
            await queryRunner.query(`
        INSERT INTO produtos (nome, categoria, tipo) VALUES
        ('Arroz 5kg', 'Alimentos', 'Grãos'),
        ('Feijão 1kg', 'Alimentos', 'Grãos'),
        ('Óleo de Soja 900ml', 'Alimentos', 'Óleos'),
        ('Sabonete', 'Higiene', 'Pessoal');
      `);
            await queryRunner.query(`
        INSERT INTO mercados (nome, endereco) VALUES
        ('Supermercado A', 'Rua das Flores, 123'),
        ('Supermercado B', 'Avenida Central, 456');
      `);
            await queryRunner.query(`
        INSERT INTO precos (produto_id, mercado_id, preco, atualizado_em) VALUES
        (1, 1, 22.90, NOW()), (2, 1, 7.99, NOW()), (3, 1, 6.50, NOW()), (4, 1, 1.99, NOW()),
        (1, 2, 23.50, NOW()), (2, 2, 8.20, NOW()), (3, 2, 6.30, NOW()), (4, 2, 2.10, NOW());
      `);
            await queryRunner.query(`
        INSERT INTO listas (usuario_id, nome) VALUES
        (1, 'Compra da semana');
      `);
            await queryRunner.query(`
        INSERT INTO itens_lista (lista_id, produto_id, quantidade) VALUES
        (1, 1, 1), (1, 2, 2), (1, 3, 1);
      `);
            await queryRunner.query(`
        INSERT INTO cestas_basicas (mercado_id, data_atualizacao, preco_total) VALUES
        (1, NOW(), 38.39), (2, NOW(), 40.10);
      `);
            await queryRunner.query(`
        INSERT INTO avaliacoes (usuario_id, mercado_id, atendimento, preco, confiabilidade, comentario) VALUES
        (1, 1, 5, 4, 5, 'Bom atendimento e produtos frescos.'),
        (2, 2, 4, 3, 4, 'Preços um pouco altos, mas confiável.');
      `);
            await queryRunner.commitTransaction();
            return { sucesso: true, mensagem: 'Dados mock restaurados com sucesso' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map