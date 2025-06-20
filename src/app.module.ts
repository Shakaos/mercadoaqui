import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AdminModule } from './modules/admin/admin.module';
import { ProdutoModule } from './modules/produtos/produto.module';
import { CestaModule } from './modules/cestas/cesta.module';
import { ListaModule } from './modules/listas/lista.module';
import { MercadoModule } from './modules/mercados/mercado.module';

import { Produto } from './modules/produtos/produto.entity';
import { Usuario } from './modules/usuarios/usuario.entity';
import { Preco } from './modules/precos/preco.entity';
import { Mercado } from './modules/mercados/mercado.entity';
import { CestaBasica } from './modules/cestas/cesta.entity';
import { CestaProduto } from './modules/cestas/cesta_produto.entity';
import { Lista } from './modules/listas/lista.entity';
import { ItemLista } from './modules/listas/item-lista.entity';

@Module({
  imports: [
    // Carrega variáveis do .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexão com o banco de dados MySQL via TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Usuario, Produto, Preco, Mercado, CestaBasica, CestaProduto, Lista, ItemLista],
      logging: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    // Módulo JWT global
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),

    // Módulos da aplicação
    UsuariosModule,
    AdminModule,
    ProdutoModule,
    CestaModule,
    ListaModule,
    MercadoModule,
  ],
})
export class AppModule {}
