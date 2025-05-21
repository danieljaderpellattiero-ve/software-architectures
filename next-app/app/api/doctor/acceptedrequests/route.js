import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import PatientRequest from '@/models/PatientRequest';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await connectDB();

    // Get doctor user ID from query parameters
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    console.log('GET /api/doctor/acceptedrequests: Received doctorId from query:', doctorId);

    if (!doctorId) {
      console.warn('GET /api/doctor/acceptedrequests: doctorId query parameter not found.');
      return NextResponse.json({ error: 'Doctor ID not provided' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      console.warn('GET /api/doctor/acceptedrequests: Invalid doctor ID format from query:', doctorId);
      return NextResponse.json({ error: 'Invalid doctor ID format' }, { status: 400 });
    }

    // Find all accepted patient requests for this doctor
    console.log('GET /api/doctor/acceptedrequests: Fetching accepted patient requests for doctorId:', doctorId);
    const acceptedRequests = await PatientRequest.find({ 
      doctorId: new mongoose.Types.ObjectId(doctorId),
      status: true // Filter for accepted requests
    }).sort({ acceptedAt: -1 }); // Sort by acceptance date

    console.log('GET /api/doctor/acceptedrequests: Fetched accepted requests count:', acceptedRequests.length);

    return NextResponse.json(acceptedRequests);

  } catch (error) {
    console.error('Error fetching accepted patient requests:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 