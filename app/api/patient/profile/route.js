import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import mongoose from 'mongoose';
import User from '@/models/User'; // Import the User model

// Define the Patient schema
const patientSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: String,
  surname: String,
  nationalCode: String,
  dateOfBirth: Date,
  educationLevel: String,
  email: String,
  phoneNumber: String,
  phoneCode: String,
  country: String,
  city: String
});

// Create the model if it doesn't exist
const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // TODO: Replace with actual user ID from your authentication system
    const userId = "123"; // <<< GET ACTUAL USER ID HERE
    
    console.log('Fetching patient with userId:', userId);
    let patient = await Patient.findOne({ userId });
    
    if (!patient) {
      console.log('Patient not found, creating new patient record');
      
      // Fetch user data using the userId
      const user = await User.findById(userId); // Assuming userId is the User document's _id

      let firstName = '';
      let surname = '';
      let email = '';
      let phoneNumber = '';

      if (user) {
        // Attempt to split the name into first and last name
        const nameParts = user.name ? user.name.split(' ') : [];
        firstName = nameParts[0] || '';
        surname = nameParts.slice(1).join(' ') || '';
        email = user.email || '';
        phoneNumber = user.phoneNumber || '';
      } else {
          console.warn(`User not found for userId: ${userId}. Creating patient profile with empty data.`);
      }

      // Create a new patient record, pre-filling fields from user data
      patient = await Patient.create({
        userId,
        firstName,
        surname,
        nationalCode: '',
        dateOfBirth: '',
        educationLevel: '',
        email,
        phoneNumber,
        phoneCode: '+98',
        country: '',
        city: ''
      });
      console.log('New patient record created with user data:', patient);
    }
    
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error in GET /api/patient/profile:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    const data = await request.json();
    console.log('Received data:', data);
    
    // TODO: Replace with actual user ID from your authentication system
    const userId = "123"; // <<< GET ACTUAL USER ID HERE
    
    console.log('Updating patient with userId:', userId);
    const patient = await Patient.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );
    
    console.log('Patient updated successfully:', patient);
    return NextResponse.json({ success: true, patient });
  } catch (error) {
    console.error('Error in PUT /api/patient/profile:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 