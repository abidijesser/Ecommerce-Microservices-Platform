import { Document } from 'mongoose';
export type ReclamationDocument = Reclamation & Document;
export declare class Reclamation {
    name: string;
    number: string;
    email: string;
    description: string;
}
export declare const ReclamationSchema: import("mongoose").Schema<Reclamation, import("mongoose").Model<Reclamation, any, any, any, Document<unknown, any, Reclamation> & Reclamation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reclamation, Document<unknown, {}, import("mongoose").FlatRecord<Reclamation>> & import("mongoose").FlatRecord<Reclamation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
