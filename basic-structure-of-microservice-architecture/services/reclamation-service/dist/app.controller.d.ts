import { AppService } from './app.service';
import { Reclamation } from './reclamation.schema';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createReclamation(reclamation: Reclamation): Promise<Reclamation>;
    getAllReclamations(): Promise<Reclamation[]>;
    deleteReclamation(id: string): Promise<import("mongoose").Document<unknown, {}, import("./reclamation.schema").ReclamationDocument> & Reclamation & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
