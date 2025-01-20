import { Request, Response } from 'express';
import User from '../models/user.model';

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Doctor with this email already exists' });
            return;
        }

        const newDoctor = new User({ name, email, password, role: 'doctor' });
        await newDoctor.save();

        res.status(201).json({ message: 'Doctor created successfully', doctor: newDoctor });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in createDoctor:', error.message);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        } else {
            console.error('Unknown error in createDoctor:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getDoctors = async (req: Request, res: Response): Promise<void> => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.status(200).json(doctors);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getDoctors:', error.message);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        } else {
            console.error('Unknown error in getDoctors:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
