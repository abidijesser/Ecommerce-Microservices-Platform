import { ConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private readonly configService;
    private config;
    constructor(configService: ConfigService);
    loadConfig(): Promise<void>;
    get(key: string): any;
}
