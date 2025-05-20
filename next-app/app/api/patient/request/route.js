import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import PatientRequest from '@/models/PatientRequest';
import User from '@/models/User';

export async function POST(request) {
  try {
    console.log('API Request POST: Received request');
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Get user ID from the header set by middleware
    const userId = request.headers.get('userId');
    console.log('API Request POST: Received userId from header:', userId);

    if (!userId) {
      console.warn('API Request POST: userId header not found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    console.log('API Request POST: Received data:', data);

    // Get patient details from User collection
    const patient = await User.findById(userId);
    if (!patient) {
      console.warn('API Request POST: Patient not found');
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Create new request
    const newRequest = new PatientRequest({
      patientId: userId,
      patientName: `${patient.name}`,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      status: false, // false means pending
      timestamp: new Date(),
    });

    await newRequest.save();
    console.log('API Request POST: New request saved:', newRequest);

    return NextResponse.json({ 
      success: true, 
      message: 'Request sent successfully',
      request: newRequest 
    });

  } catch (error) {
    console.error('Error in POST /api/patient/request:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 