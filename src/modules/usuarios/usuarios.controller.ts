import { Body, Controller, Delete, Param, Patch, Post, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('auth')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() body: CreateUsuarioDto) {
    return this.usuariosService.registrar(body.nome, body.email, body.senha);
  }

  @Post('login')
  login(@Body() body: { email: string; senha: string }) {
    return this.usuariosService.autenticar(body.email, body.senha);
  }

  @Patch('atualizar')
  atualizar(@Body() body: { id: number; nome: string; email: string }) {
    return this.usuariosService.atualizarPerfil(body.id, body.nome, body.email);
  }

  @Delete('excluir/:id')
  excluir(@Param('id') id: string) {
    return this.usuariosService.deletarConta(Number(id));
  }

  @Get()
  listarTodos() {
    return this.usuariosService.listarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.usuariosService.buscarPorId(Number(id));
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  atualizarPorId(@Param('id') id: string, @Body() body: UpdateUsuarioDto) {
    return this.usuariosService.atualizarPerfil(Number(id), body.nome, body.email);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.usuariosService.deletarConta(Number(id));
  }
}