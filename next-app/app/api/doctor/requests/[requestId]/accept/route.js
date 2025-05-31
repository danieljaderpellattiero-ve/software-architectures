import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'; // Assuming JWT is used for doctor authentication

export async function PUT(request, { params }) {
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

    const { requestId } = params;
    const { date, time } = await request.json();

    if (!date || !time) {
        return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the patient request and update it
    const updateResult = await db.collection('patientrequests').updateOne(
      { _id: new ObjectId(requestId), doctorId: new ObjectId(decoded.id), status: false }, // Ensure the request belongs to the doctor and is still pending
      { 
        $set: {
          status: true, // true means accepted/confirmed
          appointmentDateTime: new Date(`${date}T${time}`)
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      // Could be not found, or already accepted/rejected
       return NextResponse.json({ error: 'Patient request not found or already processed' }, { status: 404 });
    }
    
     if (updateResult.modifiedCount === 0) {
       // Request was matched but not modified (e.g., status was already true)
        return NextResponse.json({ error: 'Patient request already accepted or status unchanged' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Appointment scheduled successfully' });

  } catch (error) {
    console.error('Error in PUT /api/doctor/requests/[requestId]/accept:', error);
     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 