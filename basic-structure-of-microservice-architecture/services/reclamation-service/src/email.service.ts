import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendReclamationConfirmation(email: string, reclamationId: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Réclamation Reçue',
      template: 'reclamation-confirmation', // Removed the './' prefix
      context: {
        reclamationId,
        date: new Date().toLocaleDateString('fr-FR'),
      },
    });
  }
}
