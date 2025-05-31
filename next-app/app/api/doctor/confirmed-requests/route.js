import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'; // Assuming JWT is used for doctor authentication

export async function GET(request) {
  try {
    // Authenticate the doctor (assuming JWT in cookie)
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized - Not a doctor' }, { status: 401 });
    }

    const doctorId = new ObjectId(decoded.id);
    const client = await clientPromise;
    const db = client.db();

    // Find all patient requests for the logged-in doctor with status true (accepted)
    const acceptedRequests = await db.collection('patientrequests').find(
      { doctorId: doctorId, status: true }
    ).sort({ appointmentDateTime: 1 }).toArray(); // Sort by appointment date/time

    // Convert ObjectId to strings for consistent JSON response
    const formattedRequests = acceptedRequests.map(request => ({
        ...request,
        _id: request._id.toString(),
        patientId: request.patientId.toString(),
        doctorId: request.doctorId.toString(),
    }));

    return NextResponse.json(formattedRequests);

  } catch (error) {
    console.error('Error in GET /api/doctor/confirmed-requests:', error);
     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 