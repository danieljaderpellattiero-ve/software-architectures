import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/patient.model';

export const assignDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { patientId, doctorId } = req.body;

        // Проверяем корректность ID
        if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
            res.status(400).json({ message: 'Invalid patientId or doctorId' });
            return;
        }

        // Проверяем наличие пациента
        const patient = await Patient.findById(patientId);
        if (!patient) {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }

        // Закрепляем доктора за пациентом
        patient.doctorId = doctorId;
        await patient.save();

        res.status(200).json({ message: 'Doctor assigned successfully', patient });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in assignDoctor:', error.message);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        } else {
            console.error('Unknown error in assignDoctor:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
