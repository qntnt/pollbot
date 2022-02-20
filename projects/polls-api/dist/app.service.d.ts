import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
export declare class AppService implements OnModuleInit {
    private client;
    private pollsService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    getHello(): Promise<string>;
}
