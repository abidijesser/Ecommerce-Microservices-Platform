import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reclamation, ReclamationDocument } from './reclamation.schema';
import { EmailService } from './email.service';

@Injectable()
export class AppService {
  constructor(private readonly emailService: EmailService,
    @InjectModel(Reclamation.name) private readonly reclamationModel: Model<ReclamationDocument>,
  ) {}

  async createReclamation(reclamation: Reclamation): Promise<Reclamation> {
    const newReclamation = new this.reclamationModel(reclamation);
    const savedReclamation = await newReclamation.save();
    
    try {
      await this.emailService.sendReclamationConfirmation(
        reclamation.email,
        savedReclamation._id.toString()
      );
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
    
    return savedReclamation;
  }

  async findAllReclamations(): Promise<Reclamation[]> {
    return this.reclamationModel.find().exec();
  }
  async deleteReclamation(id: string) {
    return this.reclamationModel.findByIdAndDelete(id);
  }
}
