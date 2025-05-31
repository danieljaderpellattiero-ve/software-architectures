import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'; // Assuming JWT is used for patient authentication

export async function PUT(request) {
  try {
    // Authenticate the patient (assuming JWT in cookie)
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure the user is a patient
    if (!decoded || decoded.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized - Not a patient' }, { status: 401 });
    }

    const patientId = new ObjectId(decoded.id);
    const { base64Pdf, analyzedData } = await request.json();

    console.log('API Save Analyzed Data: Received data:', { base64Pdf: base64Pdf ? '[present]' : '[missing]', analyzedData });

    if (!base64Pdf || !analyzedData) {
        return NextResponse.json({ error: 'Base64 PDF and analyzed data are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Update the patient document with the analyzed data
    const updateResult = await db.collection('users').updateOne(
      { _id: patientId, role: 'patient' }, 
      { 
        $set: {
          uploadedPdfBase64: base64Pdf, // Store the Base64 PDF data
          analyzedPdfData: analyzedData // Store the analyzed data
        }
      }
    );

    console.log('API Save Analyzed Data: Database update result:', updateResult);

    if (updateResult.matchedCount === 0) {
       return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
     if (updateResult.modifiedCount === 0) {
       // Data might be the same, or another issue preventing modification
        console.warn('Patient profile update matched but did not modify for user ID:', patientId);
        // We can still return success if matchedCount > 0, as it means the user exists.
    }

    return NextResponse.json({ message: 'Analyzed data saved successfully' });

  } catch (error) {
    console.error('Error in PUT /api/patient/profile/save-analyzed-data:', error);
     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 