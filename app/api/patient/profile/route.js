import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Get user ID from the header set by middleware
    const userId = request.headers.get('userId');
    
    if (!userId) {
       // This case should ideally not be reached if middleware is configured correctly for this route
       console.warn('API Profile GET: userId header not found');
       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn('API Profile GET: Invalid user ID format from header', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    console.log('API Profile GET: Fetching user with userId:', userId);
    const user = await User.findById(userId);
    
    if (!user) {
      console.warn(`API Profile GET: User not found for userId: ${userId}.`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Extract profile data from the user document
    const profileData = {
      firstName: user.name?.split(' ')[0] || '', // Split name into first name
      surname: user.name?.split(' ').slice(1).join(' ') || '', // Rest of the name as surname
      nationalCode: user.codiceFiscale || '',
      dateOfBirth: user.dateOfBirth || '',
      educationLevel: user.educationLevel || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      phoneCode: '+98', // Default phone code
      country: user.country || '',
      city: user.city || '',
      homeAddress: user.homeAddress || '',
      medicalData: user.medicalData || {}
    };
    
    console.log('API Profile GET: Profile data fetched successfully');
    return NextResponse.json(profileData);
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
    
    // Get user ID from the header set by middleware
    const userId = request.headers.get('userId');

    if (!userId) {
       // This case should ideally not be reached if middleware is configured correctly for this route
       console.warn('API Profile PUT: userId header not found');
       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn('API Profile PUT: Invalid user ID format from header', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const data = await request.json();
    console.log('API Profile PUT: Received data:', data);
    
    // Prepare the update data - ensure we only update fields present in the form data
    const updateData = {};
    if (data.firstName || data.surname) { // Update name only if first or surname is provided
        updateData.name = `${data.firstName || ''} ${data.surname || ''}`.trim();
    }
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.nationalCode !== undefined) updateData.codiceFiscale = data.nationalCode; // Map nationalCode to codiceFiscale
    if (data.homeAddress !== undefined) updateData.homeAddress = data.homeAddress; // Assuming homeAddress is part of profile updates
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
    if (data.educationLevel !== undefined) updateData.educationLevel = data.educationLevel;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    // Handle medicalData updates carefully if needed, perhaps merging or replacing
    if (data.medicalData !== undefined) updateData.medicalData = data.medicalData;


    console.log('API Profile PUT: Updating user with userId:', userId, ', updateData:', updateData);
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // Use $set to update specific fields
      { new: true, runValidators: true } // new: true returns the updated doc, runValidators: true applies schema validators
    );
    
    if (!user) {
      console.warn(`API Profile PUT: User not found for userId: ${userId}.`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log('API Profile PUT: User updated successfully:', user);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error in PUT /api/patient/profile:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
} 