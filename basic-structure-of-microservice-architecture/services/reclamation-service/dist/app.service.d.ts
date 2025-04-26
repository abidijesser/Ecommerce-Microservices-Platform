import { Model } from 'mongoose';
import { Reclamation, ReclamationDocument } from './reclamation.schema';
import { EmailService } from './email.service';
export declare class AppService {
    private readonly emailService;
    private readonly reclamationModel;
    constructor(emailService: EmailService, reclamationModel: Model<ReclamationDocument>);
    createReclamation(reclamation: Reclamation): Promise<Reclamation>;
    findAllReclamations(): Promise<Reclamation[]>;
    deleteReclamation(id: string): Promise<import("mongoose").Document<unknown, {}, ReclamationDocument> & Reclamation & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
