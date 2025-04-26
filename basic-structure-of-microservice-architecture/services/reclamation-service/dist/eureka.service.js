"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EurekaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let EurekaService = class EurekaService {
    constructor() {
        this.eurekaServerUrl = 'http://localhost:8761/eureka/apps/reclamation-service';
        this.instanceId = 'localhost:3001';
        this.serviceName = 'RECLAMATION-SERVICE';
    }
    async onModuleInit() {
        console.log('Registering with Eureka...');
        await this.registerWithEureka();
    }
    async registerWithEureka() {
        try {
            const response = await axios_1.default.post(this.eurekaServerUrl, {
                instance: {
                    instanceId: this.instanceId,
                    hostName: 'localhost',
                    app: this.serviceName,
                    ipAddr: '127.0.0.1',
                    status: 'UP',
                    port: { "$": 3001, "@enabled": true },
                    vipAddress: this.serviceName,
                    secureVipAddress: this.serviceName,
                    homePageUrl: 'http://localhost:3001/',
                    statusPageUrl: 'http://localhost:3001/actuator/info',
                    healthCheckUrl: 'http://localhost:3001/actuator/health',
                    dataCenterInfo: {
                        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                        name: "MyOwn"
                    }
                },
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            console.log('✅ Successfully registered with Eureka:', response.status);
        }
        catch (error) {
            console.error('❌ Eureka Registration Failed:', error.response?.data || error.message);
        }
    }
    async onModuleDestroy() {
        await this.deregisterFromEureka();
    }
    async deregisterFromEureka() {
        try {
            await axios_1.default.delete(`${this.eurekaServerUrl}/${this.instanceId}`);
            console.log('🛑 Successfully deregistered from Eureka');
        }
        catch (error) {
            console.error('❌ Failed to deregister from Eureka:', error.response?.data || error.message);
        }
    }
};
exports.EurekaService = EurekaService;
exports.EurekaService = EurekaService = __decorate([
    (0, common_1.Injectable)()
], EurekaService);
//# sourceMappingURL=eureka.service.js.map