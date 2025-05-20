import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import PatientRequest from '@/models/PatientRequest'; // Assuming you have a Mongoose model for PatientRequest
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    console.log('Connecting to database for doctor patient requests...');
    await connectDB();
    console.log('Database connected successfully for doctor patient requests GET');

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    console.log('API Doctor Patient Requests GET: Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('API Doctor Patient Requests GET: Invalid or missing authorization header');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.warn('API Doctor Patient Requests GET: No token found in authorization header');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token and get user ID
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      console.log('API Doctor Patient Requests GET: Decoded user ID:', userId);
    } catch (error) {
      console.error('API Doctor Patient Requests GET: Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn('API Doctor Patient Requests GET: Invalid user ID format from token', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    // Fetch patient requests filtered by doctorId
    console.log('API Doctor Patient Requests GET: Fetching requests for doctorId:', userId);
    const patientRequests = await PatientRequest.find({ doctorId: new mongoose.Types.ObjectId(userId) });
    
    console.log('API Doctor Patient Requests GET: Fetched requests count:', patientRequests.length);

    return NextResponse.json(patientRequests);

  } catch (error) {
    console.error('Error in GET /api/doctor/patientrequests:', error);
    return NextResponse.json({ 
      error: error.message || 'An error occurred while fetching doctor patient requests',
      details: error.stack
    }, { status: 500 });
  }
}

// Add other request handlers (POST, PUT, DELETE) as needed 