import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get total doctors
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    
    // Get total patients
    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    // Get total appointments (if you have an appointments collection)
    const totalAppointments = 0; // TODO: Implement when appointments collection is available

    const stats = {
      totalDoctors,
      totalPatients,
      totalAppointments,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Error fetching stats' },
      { status: 500 }
    );
  }
} 