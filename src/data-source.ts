import { DataSource } from 'typeorm';
import { Usuario } from './modules/usuarios/usuario.entity';
import { Produto } from './modules/produtos/produto.entity';
import { Preco } from './modules/precos/preco.entity';
import { Mercado } from './modules/mercados/mercado.entity';
import { CestaBasica } from './modules/cestas/cesta.entity';
import { Lista } from './modules/listas/lista.entity';
import { ItemLista } from './modules/listas/item-lista.entity';
import { CestaProduto } from './modules/cestas/cesta_produto.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    Usuario,
    Produto,
    Preco,
    Mercado,
    CestaBasica,
    Lista,
    ItemLista,
    CestaProduto,
  ],
  synchronize: false,
  logging: true,
  migrations: ['src/migration/*.ts'],
});
