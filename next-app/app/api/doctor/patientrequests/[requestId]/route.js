import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import PatientRequest from '@/models/PatientRequest';
import mongoose from 'mongoose';

// Accept Patient Request (Update existing document)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const awaitedParams = await params; // Await params
    const { requestId } = awaitedParams; // Destructure from awaited params
    console.log('PUT /api/doctor/patientrequests/[requestId]: Processing request ID for acceptance:', requestId);

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ message: 'Invalid request ID' }, { status: 400 });
    }

    // Find and update the patient request
    console.log('PUT /api/doctor/patientrequests/[requestId]: Finding and updating patient request by ID:', requestId);
    const updatedRequest = await PatientRequest.findByIdAndUpdate(
      requestId,
      { status: true, acceptedAt: new Date() }, // Set status to true and add acceptance timestamp
      { new: true } // Return the updated document
    );
    console.log('PUT /api/doctor/patientrequests/[requestId]: Updated patient request:', updatedRequest);

    if (!updatedRequest) {
      console.warn('PUT /api/doctor/patientrequests/[requestId]: Patient request not found for ID during update:', requestId);
      return NextResponse.json({ message: 'Patient request not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient request accepted', request: updatedRequest });

  } catch (error) {
    console.error('Error accepting patient request:', error); // Keep detailed log for debugging
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 }); // Generic message to client
  }
}

// Deny Patient Request (Delete request)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const awaitedParams = await params; // Await params
    const { requestId } = awaitedParams; // Destructure from awaited params

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ message: 'Invalid request ID' }, { status: 400 });
    }

    const deletedRequest = await PatientRequest.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return NextResponse.json({ message: 'Patient request not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient request denied and deleted' });

  } catch (error) {
    console.error('Error denying patient request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 