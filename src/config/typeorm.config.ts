import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../modules/usuarios/usuario.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin123',
  database: 'mercadoaqui',
  entities: [Usuario],
  synchronize: true, // Não usar em produção
  logging: true,
};