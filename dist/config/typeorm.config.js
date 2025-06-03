"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const usuario_entity_1 = require("../modules/usuarios/usuario.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin123',
    database: 'mercadoaqui',
    entities: [usuario_entity_1.Usuario],
    synchronize: true,
    logging: true,
};
//# sourceMappingURL=typeorm.config.js.map