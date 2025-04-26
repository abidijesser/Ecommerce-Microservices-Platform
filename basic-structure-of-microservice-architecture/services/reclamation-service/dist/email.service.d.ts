import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendReclamationConfirmation(email: string, reclamationId: string): Promise<void>;
}
