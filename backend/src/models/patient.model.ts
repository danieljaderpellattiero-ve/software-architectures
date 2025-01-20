import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
    doctorId?: mongoose.Schema.Types.ObjectId; // Ссылка на врача
}

const patientSchema = new Schema<IPatient>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User' }, // Врач
});

export default mongoose.model<IPatient>('Patient', patientSchema);
