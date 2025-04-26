"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let AppConfigService = class AppConfigService {
    constructor(configService) {
        this.configService = configService;
        this.config = {};
    }
    async loadConfig() {
        try {
            const configServerUrl = process.env.CONFIG_SERVER_URL || 'http://localhost:8888';
            const serviceName = process.env.SERVICE_NAME || 'reclamation-service';
            const response = await axios_1.default.get(`${configServerUrl}/${serviceName}/default`);
            const properties = response.data.propertySources[0].source;
            this.config = properties;
            console.log('Configuration loaded:', this.config);
        }
        catch (error) {
            console.error('Failed to fetch configuration from Config Server:', error.message);
        }
    }
    get(key) {
        return this.config[key] || this.configService.get(key);
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=config.service.js.map