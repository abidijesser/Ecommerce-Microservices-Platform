"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_module_1 = require("./config.module");
const config_service_1 = require("./config.service");
const eureka_service_1 = require("./eureka.service");
const reclamation_schema_1 = require("./reclamation.schema");
const email_service_1 = require("./email.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.AppConfigModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_module_1.AppConfigModule],
                useFactory: async (appConfigService) => {
                    await appConfigService.loadConfig();
                    return {
                        uri: `mongodb://${appConfigService.get('spring.data.mongodb.username')}:${appConfigService.get('spring.data.mongodb.password')}@${appConfigService.get('spring.data.mongodb.host')}:${appConfigService.get('spring.data.mongodb.port')}/${appConfigService.get('spring.data.mongodb.database')}?authSource=${appConfigService.get('spring.data.mongodb.authentication-database')}`,
                    };
                },
                inject: [config_service_1.AppConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([{ name: reclamation_schema_1.Reclamation.name, schema: reclamation_schema_1.ReclamationSchema }]),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'testp3253@gmail.com',
                        pass: 'ycow kiylurwijekd',
                    },
                },
                defaults: {
                    from: '"Reclamation Service" <testp3253@gmail.com>',
                },
                template: {
                    dir: process.cwd() + '/templates',
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, eureka_service_1.EurekaService, email_service_1.EmailService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map