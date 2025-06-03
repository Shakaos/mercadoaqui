import { DataSource } from 'typeorm';
export declare class AdminService {
    private dataSource;
    constructor(dataSource: DataSource);
    resetarDadosMock(): Promise<{
        sucesso: boolean;
        mensagem: string;
    }>;
}
