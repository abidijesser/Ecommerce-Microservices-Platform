import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config.module';
import { AppConfigService } from './config.service';
import { EurekaService } from './eureka.service';
import { Reclamation, ReclamationSchema } from './reclamation.schema';
import { EmailService } from './email.service';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => {
        await appConfigService.loadConfig();
        return {
          uri: `mongodb://${appConfigService.get('spring.data.mongodb.username')}:${appConfigService.get('spring.data.mongodb.password')}@${appConfigService.get('spring.data.mongodb.host')}:${appConfigService.get('spring.data.mongodb.port')}/${appConfigService.get('spring.data.mongodb.database')}?authSource=${appConfigService.get('spring.data.mongodb.authentication-database')}`,
        };
      },
      inject: [AppConfigService],
    }),
    MongooseModule.forFeature([{ name: Reclamation.name, schema: ReclamationSchema }]),
    MailerModule.forRoot({
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
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EurekaService, EmailService],
})
export class AppModule {}
