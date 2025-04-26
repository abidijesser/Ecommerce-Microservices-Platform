"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_service_1 = require("./config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_service_1.AppConfigService);
    await configService.loadConfig();
    const port = configService.get('server.port') || 3000;
    await app.listen(port);
    console.log(`Reclamation service running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map