import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    resetarMock(req: any): Promise<{
        sucesso: boolean;
        mensagem: string;
    }>;
}
