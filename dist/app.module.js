"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const usuarios_module_1 = require("./modules/usuarios/usuarios.module");
const admin_module_1 = require("./modules/admin/admin.module");
const produto_module_1 = require("./modules/produtos/produto.module");
const produto_entity_1 = require("./modules/produtos/produto.entity");
const usuario_entity_1 = require("./modules/usuarios/usuario.entity");
const preco_entity_1 = require("./modules/admin/preco.entity");
const mercado_entity_1 = require("./modules/admin/mercado.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                entities: [usuario_entity_1.Usuario, produto_entity_1.Produto, preco_entity_1.Preco, mercado_entity_1.Mercado],
                logging: true,
                synchronize: true,
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '7d' },
            }),
            usuarios_module_1.UsuariosModule,
            admin_module_1.AdminModule,
            produto_module_1.ProdutoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map