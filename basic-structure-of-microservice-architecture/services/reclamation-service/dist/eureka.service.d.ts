import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class EurekaService implements OnModuleInit, OnModuleDestroy {
    private readonly eurekaServerUrl;
    private readonly instanceId;
    private readonly serviceName;
    onModuleInit(): Promise<void>;
    registerWithEureka(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    deregisterFromEureka(): Promise<void>;
}
