
import { Controller, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('resetar-mock')
  async resetarMock(@Request() req) {
    if (req.user?.tipo !== 'funcionario') {
      throw new ForbiddenException('Apenas funcionários podem resetar o mock');
    }

    return this.adminService.resetarDadosMock();
  }
}
